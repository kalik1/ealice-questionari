import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Config } from '../config';
import { User } from '../user/entities/user.entity';
import { Coop } from '../coop/entities/coop.entity';
import { Patient } from '../patient/entities/patient.entity';
import { Answer } from '../answer/entities/answer.entity';
import { Question } from '../questions/entities/question.entity';
import { SingleAnswer } from '../answer/entities/single-answer.entity';
import { SingleResult } from '../answer/entities/single-result.entity';
import { SingleTextAnswer } from '../answer/entities/single-text-answer.entity';
import { QuestionSingle } from '../questions/entities/question-single.entity';
import { QuestionSingleResult } from '../questions/entities/question-single-result.entity';
import { QuestionSingleOption } from '../questions/entities/question-single-options.entity';
import { QuestionSingleResultOption } from '../questions/entities/question-single-result-options.entity';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'unicorn_user',
  password: process.env.DB_PASS || 'magical_password',
  // logging: true,
  database: process.env.DB_DATABASE || 'coop_question',
  migrations: ['{src,dist}/migrations/*.migration.{ts,js}'],
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
    QuestionSingleResultOption,
  ],
  // entities: [`${Config.getFolderForDb()}/**/*.entity{.ts,.js}`],
  synchronize: process.env.SYNC_DB === 'true' || Config.isDev(),
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
