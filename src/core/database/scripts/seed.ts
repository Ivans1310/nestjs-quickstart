import { Umzug, SequelizeStorage } from 'umzug';

import { databaseProviders } from '../database.providers';
import { Logger } from '@nestjs/common';
const logger = new Logger('SeedScript');
logger['info'] = logger.log;

async function seed() {
  const args = process.argv.slice(2);
  const sequelize = await databaseProviders[0].useFactory();
  const seeder = new Umzug({
    migrations: {
      glob: ['../seeders/*.ts', { cwd: __dirname }],
    },
    context: sequelize,
    storage: new SequelizeStorage({
      sequelize,
      modelName: 'seeder_meta',
    }),
    logger: console,
  });

  if (args[1] === 'up') {
    await seeder.up();
  } else if (args[1] === 'down') {
    await seeder.down();
  }
}

seed();
