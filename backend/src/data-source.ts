import 'reflect-metadata';
import { DataSource } from 'typeorm';
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

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'unicorn_user',
  password: process.env.DB_PASS || 'magical_password',
  database: process.env.DB_DATABASE || 'coop_question',
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
  migrations: ['./migrations/*.migration.{ts,js}'],
});

export default AppDataSource;


