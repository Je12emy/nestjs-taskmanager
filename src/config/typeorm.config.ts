import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres', // use the pg driver
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'taskmanagement',
    autoLoadEntities: true, // Fix for loading entities instead of relative path
    synchronize: true, // When a connection is stablished the entities will be linked
}