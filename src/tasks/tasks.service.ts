import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task-.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  // Inject the repository and provide it here through this parameter
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}
  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
  //   const { search, status } = filterDto;
  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }

  //   return tasks;
  // }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id); // Stop execution and wait for this operation to complete

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    return found;
  }

  createTask(createTaskDTO: CreateTaskDto) {
    return this.taskRepository.createTask(createTaskDTO);
  }

  // deleteTask(id: string): Task {
  //   const found = this.getTaskById(id);
  //   const deletedTask = this.tasks.find((task) => task.id === found.id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  //   return deletedTask;
  // }

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.deleteTaskById(id);
  }

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
