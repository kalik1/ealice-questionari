import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ReadAnswerDto } from './dto/read-answer.dto';
import { plainToClass } from 'class-transformer';
import { IdDto } from '../base/dto/id.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsCoopMember } from '../coop/guard/isCoopMember';
import { GetCoop } from '../coop/guard/getCoop.decorator';
import { Coop } from '../coop/entities/coop.entity';
import { PatientIdDto } from '../base/dto/patient-id.dto';
import { PatientService } from '../patient/patient.service';
import { ReadCoopDto } from '../coop/dto/read-coop.dto';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('patient/:patientId/answer')
@ApiTags('Answer')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly patientService: PatientService,
  ) {}

  @Post()
  @IsCoopMember()
  @ApiResponse({ type: ReadAnswerDto, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAnswerDto: CreateAnswerDto,
    @GetCoop() coop: Coop[],
    @GetUser() user: User,
    @Param() { patientId }: PatientIdDto,
  ): Promise<ReadAnswerDto> {
    const patient = await this.patientService.findOne(patientId, coop);
    if (!patient) throw new NotFoundException();
    console.log(createAnswerDto);
    const answer = await this.answerService.create({
      ...createAnswerDto,
      patient,
      user,
      coop: coop[0],
    });
    return plainToClass(ReadAnswerDto, answer, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @IsCoopMember()
  @ApiResponse({ type: ReadAnswerDto, isArray: true, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetCoop() coop: Coop[], @Param() { patientId }: PatientIdDto) {
    const patient = await this.patientService.findOne(patientId, coop);
    if (!patient) throw new NotFoundException();
    return plainToClass(
      ReadAnswerDto,
      this.answerService.findAll(coop, patient),
      { excludeExtraneousValues: true },
    );
  }

  @Get(':id')
  @IsCoopMember()
  @ApiResponse({ type: ReadCoopDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param() { id }: IdDto,
    @GetCoop() coop: Coop[],
    @Param() { patientId }: PatientIdDto,
  ) {
    const patient = await this.patientService.findOne(patientId, coop);
    if (!patient) throw new NotFoundException();
    const foundAnswer = await this.answerService.findOne(id, coop, patient);
    return plainToClass(ReadAnswerDto, foundAnswer, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @IsCoopMember()
  @ApiResponse({ type: ReadCoopDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param() { id }: IdDto,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @GetCoop() coop: Coop[],
    @Param() { patientId }: PatientIdDto,
  ) {
    const patient = await this.patientService.findOne(patientId, coop);
    if (!patient) throw new NotFoundException();
    if (Object.entries(updateAnswerDto).length < 1)
      throw new BadRequestException();
    return plainToClass(
      ReadAnswerDto,
      this.answerService.update(id, updateAnswerDto, coop, patient),
      { excludeExtraneousValues: true },
    );
  }

  @Delete(':id')
  @IsCoopMember()
  @ApiResponse({ type: ReadAnswerDto, status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param() { id }: IdDto,
    @GetCoop() coop: Coop[],
    @Param() { patientId }: PatientIdDto,
  ) {
    const patient = await this.patientService.findOne(patientId, coop);
    if (!patient) throw new NotFoundException();
    return plainToClass(
      ReadAnswerDto,
      this.answerService.remove(id, coop, patient),
      { excludeExtraneousValues: true },
    );
  }
}
