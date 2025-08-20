import { QuestionnaireProcessor } from './questionnarie-processor.interface';
import { CreateAnswerDto } from '../../answer/dto/create-answer.dto';
import { BadRequestException } from '@nestjs/common';
import { Patient } from '../../patient/entities/patient.entity';

export class NeonatiProcessor implements QuestionnaireProcessor {
  a: CreateAnswerDto & { patient: Patient };
  private deps?: {
    fetchLatestValueByKey?: (key: string) => Promise<number | null>;
  };

  constructor(
    a: CreateAnswerDto & { patient: Patient },
    deps?: { fetchLatestValueByKey?: (key: string) => Promise<number | null> },
  ) {
    if (!a.patient)
      throw new BadRequestException('Missing Patient in Neonati Processor!');
    this.a = a;
    this.a.results = this.a.results ?? [];
    this.deps = deps;
  }

  private async getNum(key: string): Promise<number | null> {
    const v = this.a.answers.find((ans) => ans.key === key)?.value as
      | number
      | undefined;
    const local = typeof v === 'number' && !Number.isNaN(v) ? v : null;
    if (local != null) return local;

    // Fallback to latest stored value for specific keys if available
    if (this.deps?.fetchLatestValueByKey && key === 'peso_neonato') {
      try {
        const fetched = await this.deps.fetchLatestValueByKey(key);
        return typeof fetched === 'number' && !Number.isNaN(fetched)
          ? fetched
          : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  async process(): Promise<CreateAnswerDto> {
    // Derived: SpO2/FiO2 ratio (if FiO2 is fraction like 0.21..1)
    const spo2 = await this.getNum('spo2');
    const fio2 = await this.getNum('fio2');
    if (spo2 != null && fio2 != null && fio2 > 0) {
      this.a.results.push({
        key: 'spo2_fio2_ratio',
        value: Number((spo2 / fio2).toFixed(2)),
      });
    }

    // Derived: Diuresi oraria stimata (ml/kg/h) if available
    const pesoPannolinoG = await this.getNum('peso_pannolino'); // grams ~ ml
    const pesoNeonatoKg = await this.getNum('peso_neonato');
    const oreTrascorse = await this.getNum('ore_trascorse');

    if (
      pesoPannolinoG != null &&
      pesoNeonatoKg != null &&
      pesoNeonatoKg > 0 &&
      oreTrascorse != null &&
      oreTrascorse > 0
    ) {
      const diuresi = pesoPannolinoG / pesoNeonatoKg / oreTrascorse;
      this.a.results.push({
        key: 'diuresi_oraria_ml_kg_h',
        value: Number(diuresi.toFixed(2)),
      });
    }

    return this.a;
  }

  public async processAndValidate(): Promise<CreateAnswerDto> {
    // No custom validator yet; hook for future rules
    return this.process();
  }
}
