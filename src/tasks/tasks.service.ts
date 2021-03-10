import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task-.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  // Inject the repository and provide it here through this parameter
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  getAllTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

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

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.deleteTaskById(id);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}
