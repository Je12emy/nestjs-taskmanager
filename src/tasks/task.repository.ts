import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task-.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDTO: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;

    await task.save();

    return task;
  }

  async deleteTaskById(id: number): Promise<void> {
    const result = await Task.delete(id); // delete does not search for the entity in the DB, this is nice since we reduce the DB queries overall.

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
  }
}
