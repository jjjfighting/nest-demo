import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { Logs } from './src/logs/logs.entity';
// import { Roles } from './src/roles/roles.entity';
// import { Profile } from './src/user/profile.entity';
// import { User } from './src/user/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { ConfigEnum } from 'src/enum/config.enum';

const getEnv = (env: string) => {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
};

const buildOpts = () => {
  const defaultConfig = getEnv('.env');
  const now = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);
  // console.log('now: ', now);

  const config = {
    ...defaultConfig,
    ...now,
  };
  console.log('config: ', config);

  const entitiesDir = [__dirname + '/**/*.entity{.js, .ts}'];

  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: config[ConfigEnum.DB_PORT],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    // entities: [User, Profile, Logs, Roles],
    entities: entitiesDir,
    synchronize: true,
    logging: true,
  } as TypeOrmModuleOptions;
};

export const connectionParams = buildOpts();
// export const connectionParams = {
//   type: 'mysql',
//   host: '127.0.0.1',
//   port: 3306,
//   username: 'root',
//   password: 'example',
//   database: 'testdb',
//   entities: [User, Profile, Logs, Roles],
//   synchronize: true,
//   logging: false,
// } as TypeOrmModuleOptions;

export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);
