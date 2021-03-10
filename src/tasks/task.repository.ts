import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task-.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/User.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDTO: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();
    delete task.user;

    return task;
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    const result = await Task.delete({ id, userId: user.id }); // delete does not search for the entity in the DB, this is nice since we reduce the DB queries overall.

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { search, status } = filterDto;

    // Query builder allows us to build out a sql query
    const query = this.createQueryBuilder('task'); // This is a method of the repository. 'task' is a keyword to refer to the task entity.

    // Add where clause WHERE userId = ?
    query.where('task.userId = :userId', { userId: user.id });

    // Apply conditionals for our query
    if (status) {
      // Query builders allow us to include aditional logic like WHERE
      query.andWhere('task.status = :status', { status }); // ':status' is a way to declare variable, so we pass the status variable
    }

    if (search) {
      // andWhere allows us to work along other WHERE clauses, LIKE is better for strings
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      ); // With %${search}% we are able to go for a fuzzy result
    }

    const tasks = await query.getMany();
    return tasks;
  }
}
