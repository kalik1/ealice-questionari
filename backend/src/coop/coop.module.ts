import { Module } from '@nestjs/common';
import { CoopService } from './coop.service';
import { CoopController } from './coop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coop } from './entities/coop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coop])],
  controllers: [CoopController],
  providers: [CoopService],
})
export class CoopModule {}
