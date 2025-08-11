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
  UseGuards,
} from '@nestjs/common';
import { CoopService } from './coop.service';
import { CreateCoopDto } from './dto/create-coop.dto';
import { ReadCoopDto } from './dto/read-coop.dto';
import { plainToClass } from 'class-transformer';
import { isAdmin } from '../auth/guard/isAdmin.guard';
import { IsLoggedIn } from '../auth/guard/isLoggedIn.guard';
import { IdDto } from '../base/dto/id.dto';
import { UpdateCoopDto } from './dto/update-coop.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRoleSetGuard } from '../user/guard/user-role-set.guard';

@Controller('coop')
@ApiTags('Coop')
export class CoopController {
  constructor(private readonly coopService: CoopService) {}

  @Post()
  @isAdmin()
  @UseGuards(UserRoleSetGuard)
  @ApiResponse({ type: ReadCoopDto, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCoopDto: CreateCoopDto): Promise<ReadCoopDto> {
    const coop = await this.coopService.create(createCoopDto);
    return plainToClass(ReadCoopDto, coop);
  }

  @Get()
  @isAdmin()
  @ApiResponse({ type: ReadCoopDto, isArray: true, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return plainToClass(ReadCoopDto, this.coopService.findAll());
  }

  @Get(':id')
  @IsLoggedIn()
  @ApiResponse({ type: ReadCoopDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param() { id }: IdDto) {
    const foundCoop = await this.coopService.findOne(id);
    return plainToClass(ReadCoopDto, foundCoop, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @isAdmin()
  @UseGuards(UserRoleSetGuard)
  @ApiResponse({ type: ReadCoopDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateCoopDto: UpdateCoopDto) {
    if (Object.entries(updateCoopDto).length < 1)
      throw new BadRequestException();
    return plainToClass(
      ReadCoopDto,
      this.coopService.update(id, updateCoopDto),
    );
  }

  @Delete(':id')
  @isAdmin()
  @ApiResponse({ type: ReadCoopDto, status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return plainToClass(ReadCoopDto, this.coopService.remove(id));
  }
}
