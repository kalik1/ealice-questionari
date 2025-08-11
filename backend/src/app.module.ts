import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './config';
import { UserModule } from './user/user.module';
import { CoopModule } from './coop/coop.module';
import { PatientModule } from './patient/patient.module';
import { AnswerModule } from './answer/answer.module';
import { QuestionsModule } from './questions/questions.module';
import { exit } from 'process';
import { User } from './user/entities/user.entity';
import { Coop } from './coop/entities/coop.entity';
import { Patient } from './patient/entities/patient.entity';
import { Answer } from './answer/entities/answer.entity';
import { Question } from './questions/entities/question.entity';
import { SingleAnswer } from './answer/entities/single-answer.entity';
import { SingleResult } from './answer/entities/single-result.entity';
import { SingleTextAnswer } from './answer/entities/single-text-answer.entity';
import { QuestionSingle } from './questions/entities/question-single.entity';
import { QuestionSingleResult } from './questions/entities/question-single-result.entity';
import { QuestionSingleOption } from './questions/entities/question-single-options.entity';
import { QuestionSingleResultOption } from './questions/entities/question-single-result-options.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'unicorn_user',
      password: process.env.DB_PASS || 'magical_password',
      // logging: true,
      database: process.env.DB_DATABASE || 'coop_question',
      migrations: ['src/migrations/*.migration.ts'],
      entities: [
        User, 
        Coop, 
        Patient, 
        Answer, 
        Question, 
        SingleAnswer, 
        SingleResult, 
        SingleTextAnswer,
        QuestionSingle,
        QuestionSingleResult,
        QuestionSingleOption,
        QuestionSingleResultOption
      ],
      // entities: [`${Config.getFolderForDb()}/**/*.entity{.ts,.js}`],
      synchronize: process.env.SYNC_DB === 'true' || Config.isDev(),
    }),
    UserModule,
    CoopModule,
    AnswerModule,
    PatientModule,
    QuestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
