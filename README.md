<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

This is a nestjs/sequelize-typescript quickstart repository where you will find these features:
* Database configuration.
* Run the database in sqlite:in-memory in development and test environments.
* Using Umzug to create scripts to run the migration and seeds from code. This function is useful for  running migrations and seeds at startup while the application is starting up in dev and test env, this is, with the database in memory.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Run migration

>**_NOTE:_** New migration or changes in the migrations code must be compiled before running.

```bash
# Build project before to run new migrations. The migrations code should be compiled in order to
# sequelize can run it.
npm run build

# Run pending migrations in local env
npm run migration:up:local

# Undo last migration in local env
npm run migration:down:local

# Run pending migrations in prod env
npm run migration:up:prod

# Undo last migration in prod env
npm run migration:down:prod

# Generate new migration
## sequelize-cli-typescript was not update with some issues in the migration creation
## @sutanlab's version has a better fixed that issue
npx @sutanlab/sequelize-cli-typescript migration:create --name [new-migration-name]

# Run seeds in local env.
export NODE_ENV=local;npx @sutanlab/sequelize-cli-typescript db:seed:all
```

### Adding a new migration
This is an example of how a migration should looks like:
It is required to add { context: queryInterface } into the argument of the up and down migration functions because this is the context provided by the umzug instance

```ts
  import {
      DataTypes
  } from 'sequelize';

  export const up = async ({ context: queryInterface }) => {
          const transaction = await queryInterface.sequelize.transaction();
          try {
              await queryInterface.addColumn(
                  'users',
                  'option',
                  {
                  type: DataTypes.STRING,
                  },
                  { transaction }
              );
              await transaction.commit();
          } catch (err) {
              await transaction.rollback();
              throw err;
            }
      }

  export const down = async ({ context: queryInterface }) => {
          const transaction = await queryInterface.sequelize.transaction();
          try {
            await queryInterface.removeColumn('users', 'option', { transaction });
            await transaction.commit();
          } catch (err) {
            await transaction.rollback();
            throw err;
          }
      }
```

## Seed
```ts
//seed example

import { QueryInterface, Sequelize } from 'sequelize';

export const up = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkInsert('users', [
    {
      id: 1,
      name: 'admin',
      whagTag: 'admin1',
      email: 'admin@polyient.games',
      password: 'admin123',
      role: 'ADMIN',
      custodial: false,
    },
  ]);

  await sequelize.getQueryInterface().bulkInsert('lists', [
    {
      id: '0x01',
      userId: 1,
      name: 'Community Blacklist',
      type: 'BLACK',
    },
  ]);
};

export const down = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().bulkDelete('users', null, {});
  await sequelize.getQueryInterface().bulkDelete('lists', null, {});
};

```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
