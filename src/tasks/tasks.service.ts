import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './task.enum';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskReporitory: TaskRepository,
  ) {}
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskReporitory.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.taskReporitory.save(task);
    return task;
  }

  async getAllTask(): Promise<Task[]> {
    const tasks = await this.taskReporitory.find();
    return tasks; //`This action returns all tasks`;
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskReporitory.findOne({
      where: {
        id,
      },
    });
    if (!task) {
      throw new NotFoundException(`task with this id ${id} does not exist`);
    }
    return task; //`This action returns a #${id} task`;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const {status, title, description} = updateTaskDto
    const task = await this.getTaskById(id);
    // if(status)
    // task.
    //return `This action updates a ${id} task`;
  }

  async deleteTask(id: number): Promise<void> {
    const task = await this.taskReporitory.delete(id);
    if (task.affected === 0) {
      throw new NotFoundException(`task with id ${id} does not exist`);
    }
    //return `This action removes a #${id} task`;
  }
}
