## Description

Domain-Driven Design + Clean Architecture for node.js

## Installation

```bash
$ npm install
```

## Development
* Monorepo
  * Based on `nestjs framework`
  * Create new app: `nest generate app`
  * Related files (after new app created)
    * `package.json`: scripts
    * `tsconfig.json`: paths
    * `nest-cli.json`: projects

* Run the app

```bash
# development
$ npm run start <app_name>

# watch mode
$ npm run start:dev <app_name>

# production mode
$ npm run start:prod <app_name>
```

## Test

* see `package.json`

```bash
# All: unit tests + e2e tests
$ npm run test

# All: unit tests
$ npm run test:unit

# One app: unit tests
$ npm run test:unit demo

# All: e2e tests
$ npm run test:e2e

# One app: e2e tests
$ npm run test:e2e:demo
```

## Todo

* ~Adapter~

  * ~EventBus~
  * ~Repository~

* ~Restful API~
* ~Database Read/Write Split~
* ~IoC/DI~
* ~Logger~
* EventBus (nestjs)

## Read More

* [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
