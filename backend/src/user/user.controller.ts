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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReadUserDto } from './dto/read-user.dto';
import { User } from './entities/user.entity';
import { plainToClass } from 'class-transformer';
import { IsLoggedIn } from '../auth/guard/isLoggedIn.guard';
import { GetUser } from './get-user.decorator';
import { IdDto } from '../base/dto/id.dto';
import { IsCoopAdminOrAdmin } from '../coop/guard/isCoopAdminOrAdmin';
import { GetCoop } from '../coop/guard/getCoop.decorator';
import { Coop } from '../coop/entities/coop.entity';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @IsCoopAdminOrAdmin()
  @ApiResponse({ type: ReadUserDto, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
    const user = await this.userService.create(createUserDto);
    return plainToClass(ReadUserDto, user);
  }

  @Get()
  @IsCoopAdminOrAdmin()
  @ApiResponse({ type: ReadUserDto, isArray: true, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  findAll(@GetCoop() coop: Coop[] = []) {
    return plainToClass(ReadUserDto, this.userService.findAll(coop));
  }

  @Get('me')
  @IsLoggedIn()
  @ApiResponse({ type: ReadUserDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async findMe(@GetUser() user: User) {
    const foundUser = await this.userService.findOne(user.id);
    return plainToClass(ReadUserDto, foundUser);
  }

  @Get(':id')
  @IsLoggedIn()
  @ApiResponse({ type: ReadUserDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param() { id }: IdDto) {
    const foundUser = await this.userService.findOne(id);
    return plainToClass(ReadUserDto, foundUser);
  }

  @Patch(':id')
  @IsLoggedIn()
  @ApiResponse({ type: ReadUserDto, status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (Object.entries(updateUserDto).length < 1)
      throw new BadRequestException();
    return plainToClass(
      ReadUserDto,
      this.userService.update(id, updateUserDto),
    );
  }

  @Delete(':id')
  @IsLoggedIn()
  @ApiResponse({ type: ReadUserDto, status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return plainToClass(ReadUserDto, this.userService.remove(id));
  }
}
