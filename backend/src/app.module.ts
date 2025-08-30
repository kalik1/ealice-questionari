import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { UserModule } from './user/user.module';
import { CoopModule } from './coop/coop.module';
import { PatientModule } from './patient/patient.module';
import { AnswerModule } from './answer/answer.module';
import { QuestionsModule } from './questions/questions.module';
import typeorm from './config/typeorm';
import { GraphqlFeatureModule } from './graphql/graphql.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    UserModule,
    CoopModule,
    AnswerModule,
    PatientModule,
    QuestionsModule,
    GraphqlFeatureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
