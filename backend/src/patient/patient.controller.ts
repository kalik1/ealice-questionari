import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ReadPatientDto } from './dto/read-patient.dto';
import { plainToClass } from 'class-transformer';
import { IdDto } from '../base/dto/id.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsCoopMember } from '../coop/guard/isCoopMember';
import { GetCoop } from '../coop/guard/getCoop.decorator';
import { Coop } from '../coop/entities/coop.entity';
import { IsCoopAdmin } from '../coop/guard/isCoopAdmin';

@Controller('patient')
@ApiTags('Patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @IsCoopAdmin()
  @ApiResponse({ type: ReadPatientDto, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPatientDto: CreatePatientDto,
    @GetCoop() coop: Coop[],
  ): Promise<ReadPatientDto> {
    const patient = await this.patientService.create({
      ...createPatientDto,
      coop: coop[0],
    });
    return plainToClass(ReadPatientDto, patient);
  }

  @Get()
  @IsCoopMember()
  @ApiResponse({ type: ReadPatientDto, isArray: true, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  findAll(@GetCoop() coop: Coop[]) {
    return plainToClass(ReadPatientDto, this.patientService.findAll(coop));
  }

  @Get(':id')
  @ApiResponse({ type: ReadPatientDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @IsCoopMember()
  async findOne(@Param() { id }: IdDto, @GetCoop() coop: Coop[]) {
    const foundPatient = await this.patientService.findOne(id, coop);
    return plainToClass(ReadPatientDto, foundPatient, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @IsCoopAdmin()
  @ApiResponse({ type: ReadPatientDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  update(
    @Param() { id }: IdDto,
    @Body() updatePatientDto: UpdatePatientDto,
    @GetCoop() coop: Coop[],
  ) {
    if (Object.entries(updatePatientDto).length < 1)
      throw new BadRequestException();
    return plainToClass(
      ReadPatientDto,
      this.patientService.update(id, updatePatientDto, coop),
    );
  }

  @Delete(':id')
  @IsCoopAdmin()
  @ApiResponse({ type: ReadPatientDto, status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() { id }: IdDto, @GetCoop() coop: Coop[]) {
    return plainToClass(ReadPatientDto, this.patientService.remove(id, coop));
  }
}
