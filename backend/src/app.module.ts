import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DataSource } from 'typeorm';
import { extendSchema, parse } from 'graphql';
import { buildDynamicQuestionnaireSDL } from './graphql';

import { UserModule } from './user/user.module';
import { CoopModule } from './coop/coop.module';
import { PatientModule } from './patient/patient.module';
import { AnswerModule } from './answer/answer.module';
import { QuestionsModule } from './questions/questions.module';
import typeorm from './config/typeorm';
import { GraphqlFeatureModule } from './graphql/graphql.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Config } from './config';

function GraphQLModulePlugins() {
  if (Config.isDev()) {
    return [ApolloServerPluginLandingPageLocalDefault()];
  }
  return [];
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    // Moved above to allow injection into GraphQLModule factory
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService, DataSource],
      useFactory: async (
        configService: ConfigService,
        dataSource: DataSource,
      ): Promise<ApolloDriverConfig> => {
        const dynamicSDL = await buildDynamicQuestionnaireSDL(dataSource);
        return {
          autoSchemaFile: true,
          sortSchema: true,
          playground: false,
          introspection: true,
          plugins: [...GraphQLModulePlugins()],
          context: ({ req, res }) => ({ req, res }),
          transformSchema: (schema) =>
            dynamicSDL.trim().length > 0
              ? extendSchema(schema, parse(dynamicSDL))
              : schema,
        } as ApolloDriverConfig;
      },
    }),
    AuthModule,
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
