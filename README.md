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
  - npm run migration:generate name # Crea migraciones por un nombre dado
  - npm run migration:run # Corre las migraciones pendientes encontradas
  - npm run migration:revert # Hace un rollback de las últimas migraciones ejecutadas
```

## Seeders

- Ejecutar desde consola:

```bash
- npm run seed
```

## Ejecutar aplicación

```bash
- npm run start # development
- npm run start:dev # watch mode
- npm run start:prod # production mode
```
