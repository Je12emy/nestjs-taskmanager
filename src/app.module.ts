import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot(typeOrmConfig), // Make this module available for all submodules
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
