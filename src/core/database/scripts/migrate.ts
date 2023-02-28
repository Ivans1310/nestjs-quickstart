import { Umzug, SequelizeStorage } from 'umzug';
import { databaseProviders } from '../database.providers';
import { Logger } from '@nestjs/common';
const logger = new Logger('MigrationScript');
logger['info'] = logger.log;

async function migrate() {
  const args = process.argv.slice(2);
  const sequelize = await databaseProviders[0].useFactory();
  const umzug = new Umzug({
    migrations: { glob: 'src/core/database/migrations/*.ts' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: logger as unknown as Console,
  });

  if (args[1] === 'up') await umzug.up();
  else if (args[1] === 'down') {
    await umzug.down();
  }
}

migrate();
