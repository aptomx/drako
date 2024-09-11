# Development steps

1.  Correr comando en consola: **nest g mo modules/nameModule**
2.  Entrar al módulo creado: **cd src/modules/nameModule**
3.  Correr el comando: **mkdir -p domain/enums domain/interfaces domain/models domain/repositories domain/services errors infrastructure/commands infrastructure/controllers infrastructure/entities infrastructure/repositories**
4.  Crear el **interface** del "modelo-entidad base" en **domain/interfaces** y si es requerido extender de **BaseEntity** (src/lib/abstracts/base.abstract)
5.  Crear entidad en **infrastructure/entities** y extender de "Model" de sequelize-typescript incluyendo el interface de **domain/interfaces** -> extends Model< INameInterface >
6.  Crear modelo en **domain/models** e implementar del interface de **domain/interfaces**
7.  Importar en módulo entidad sequelize
    1. `imports: [SequelizeModule.forFeature([NameEntity])]`
    2. `En este punto seria bueno crear la migracion y ejecutarla`
8.  Crear interface con métodos a trabajar con la db en **domain/repositories**
9.  Crear repositorio en **infrastructure/repositories** e implementar de **domain/repositories**
10. En módulo creado añadir en **providers** inyección del repositorio

    1.  `{provide: INameDatabaseRepository, useClass: DatabaseNameRepository}`

11. Crear servicio en módulo (desde raíz) : **nest g s modules/nameModule/domain/services/nameService --no-spec --flat**
12. Crear controlador en modulo (desde raíz) : **nest g co modules/nameModule/infrastructure/controllers/nameController --no-spec --flat**
13. Trabajar con servicio, comandos y controlador

> Los servicios se conectan con el repositorio por medio de inyección de dependencias y tienen la lógica de negocio a traves de los modelos.
>
> **constructor(
> @Inject(INameDatabaseRepository)
> private readonly nameDatabaseRepository: INameDatabaseRepository,
> ) {}**
