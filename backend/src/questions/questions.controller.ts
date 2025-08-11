import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCoop } from '../coop/guard/getCoop.decorator';
import { Coop } from '../coop/entities/coop.entity';
import { ReadQuestionDto } from './dto/read-question.dto';
import { IsCoopMember } from '../coop/guard/isCoopMember';
import { plainToClass } from 'class-transformer';
import * as util from 'util';
import { QuestionnaireId } from './dto/QuestionnaireId.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { isAdmin } from '../auth/guard/isAdmin.guard';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @isAdmin()
  @ApiResponse({ type: ReadQuestionDto, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    const q = await this.questionsService.create(createQuestionDto);
    return plainToClass(ReadQuestionDto, q, { excludeExtraneousValues: true });
  }

  @Get()
  @IsCoopMember()
  @ApiResponse({ type: ReadQuestionDto, isArray: true, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetCoop() coop: Coop[]) {
    return plainToClass(ReadQuestionDto, this.questionsService.findAll(coop), {
      excludeExtraneousValues: true,
    });

  }

  @Get(':id')
  @IsCoopMember()
  @ApiResponse({ type: ReadQuestionDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param() { id }: QuestionnaireId, @GetCoop() coop: Coop[]) {
    const r = await this.questionsService.findOne(id, coop);
    return plainToClass(
      ReadQuestionDto,
      this.questionsService.findOne(id, coop),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  @Patch(':id')
  @isAdmin()
  @ApiResponse({ type: ReadQuestionDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.questionsService.remove(+id);
  // }
}
