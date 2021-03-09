import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task-.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { search, status } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with ID: "${id}" not found`); // Throw not found err, if controller does not catch it, Nest with create a 404 response
    }

    return found; 
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    // Create a new task, use the uuid package to generate a unique id
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN, // Use the predefined value of open
    };

    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): Task {
    const deletedTask = this.tasks.find((task) => task.id === id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return deletedTask;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
