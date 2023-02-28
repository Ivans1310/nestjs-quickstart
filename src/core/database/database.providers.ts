import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION, LOCAL } from '../constants';
import { databaseConfig } from './database.config';
import { Logger } from '@nestjs/common';
import { Umzug, SequelizeStorage } from 'umzug';
import { User } from 'src/modules/users/user.entity';

require('ts-node/register');

const logger = new Logger('databaseProviders');
logger['info'] = logger.log;

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sqliteMemoryConfig = [
        'sqlite::memory:',
        {
          logging: logger.log,
          logQueryParameters: true,
          dialectOptions: {
            useUTC: true, //for reading from database
            dateStrings: true,
            typeCast: true,
            timezone: 'utc',
          },
        },
      ];

      let config;

      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          logger.log(`Using sqlite::memory for SEQUELIZE`);
          (config = sqliteMemoryConfig[0]), sqliteMemoryConfig[1];
          break;

        case TEST:
          logger.log(`Using sqlite::memory for SEQUELIZE`);
          (config = sqliteMemoryConfig[0]), sqliteMemoryConfig[1];
          break;

        case LOCAL:
          config = databaseConfig.local;
          break;

        case PRODUCTION:
          config = databaseConfig.production;
          break;

        default:
          logger.log(`Using sqlite::memory for SEQUELIZE`);
          (config = sqliteMemoryConfig[0]), sqliteMemoryConfig[1];
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        User
      ]);

      try {
        await sequelize.sync();
      } catch (error) {
        logger.error(error.message);
      }

      const seeder = new Umzug({
        migrations: {
          glob: 'src/core/database/seeders/*.ts',
        },
        context: sequelize,
        storage: new SequelizeStorage({
          sequelize,
          modelName: 'seeder_meta',
        }),
        logger: console,
      });

      try {
        await seeder.up();
      } catch (error) {
        logger.error(error);
        if (process.env.NODE_ENV !== DEVELOPMENT) {
          throw new Error(error);
        }
      }

      if (
        process.env.NODE_ENV === DEVELOPMENT ||
        process.env.NODE_ENV == TEST
      ) {
        const umzug = new Umzug({
          migrations: { glob: 'src/core/database/migrations/*.ts' },
          context: sequelize.getQueryInterface(),
          storage: new SequelizeStorage({ sequelize }),
          logger: logger as unknown as Console,
        });
        await umzug.up();
      }

      return sequelize;
    },
  },
];
