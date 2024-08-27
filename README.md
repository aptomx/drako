# Drako

Api base en [NestJs](https://nestjs.com/) framework.

## General

Existen 2 paquetes principales:

- El **dominio** es el responsable de representar los conceptos del negocio y su lógica, no tiene dependencia externa.
  - modelos
  - servicios
- **La infraestructura** contiene todos los detalles técnicos, configuración e implementaciones. No debe contener ninguna lógica comercial. **Es la capa más volátil**. Dado que es muy probable que las cosas en esta capa cambien, se mantienen lo más lejos posible de las capas de dominio más estables.
  - Conexión base de datos
  - Conexión provedores externos

## Estructura

Podrás encontrar [aquí](https://github.com/aptomx/drako/blob/main/folders-structure.md) la estructura del proyecto.

## Pasos nuevos módulos

Podrás encontrar [aquí](https://github.com/aptomx/drako/blob/main/development-steps.md) los pasos para implementar nuevos módulos.

## Instalación

1. Ejecutar en la consola

```bash
npm install
```

2. Configurar .env

## Migraciones

- Ejecutar desde consola:

```bash
  - npx sequelize-cli migration:generate --name migrations_name # Crea un archivo en blanco para configurar la migración
  - npx sequelize-cli db:migrate # Corre las migraciones pendientes encontradas
  - npx sequelize-cli db:migrate:undo # Hace un rollback de la ultima migración
  - npx sequelize-cli db:migrate:undo:all # Hace un rollback de las migraciones
```

- Nota:

```
  	Los archivos de migraciones se crean con dos metodos lo cuales se tienen que llenar:
  	- up: Los cambios a realizar en la base de datos
  	- down: Los cambios a realizar cuando se haga un rollback
```

## Seeders

- Ejecutar desde consola:

```bash
- npx sequelize-cli seed:generate --name demo-user # Crea un archivo seed
- npx sequelize-cli db:seed:all # Corre todos los seeds
- npx sequelize-cli db:seed --seed name-of-seed # Corre un seed especifico
- npx sequelize-cli db:seed:undo # Rollback al ultimo seed
- npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data # Rollback a un seed en especifico
- npx sequelize-cli db:seed:undo:all # Rollback todos los seeds
```

## Ejecutar aplicación

```bash
- npm run start # development
- npm run start:dev # watch mode
- npm run start:prod # production mode
```

# Docker

Ejecutar docker-compose.yml

```bash
$ docker-compose up -d
```

Ejecutar migraciones

```bash
$ docker-compose exec app npm run migration:run
```

Ejecutar seeds

```bash
$ docker-compose exec app npm run seed
```

Apagar docker-compose.yml

```bash
$ docker-compose down
```

Apagar docker-compose.yml y eliminar volúmenes

```bash
$ docker-compose down -v
```
