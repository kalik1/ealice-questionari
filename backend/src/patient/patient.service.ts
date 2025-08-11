import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { Coop } from '../coop/entities/coop.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async create(
    createPatientDto: CreatePatientDto & { coop: Coop },
  ): Promise<Patient> {
    const newPatient = this.patientsRepository.create(createPatientDto);
    const patient = await this.patientsRepository.save(newPatient);
    return this.findOne(patient.id, [createPatientDto.coop]);
  }

  findAll(coop: Coop[]) {
    return this.patientsRepository.find({
      where: { coop: In(coop.map((c) => c.id)) },
    });
  }

  findOne(id: string, coop: Coop[]): Promise<Patient | undefined> {
    return this.patientsRepository.findOne({
      where: { id, coop: In(coop.map((c) => c.id)) },
    });
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
    coop: Coop[],
  ): Promise<Patient> {
    await this.patientsRepository.update(id, updatePatientDto);
    return this.findOne(id, coop);
  }

  async remove(id: string, coop: Coop[]): Promise<Patient> {
    const patient = await this.findOne(id, coop);
    await this.patientsRepository.remove(patient);
    return patient;
  }
}
