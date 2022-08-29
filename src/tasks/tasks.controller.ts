import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { JwtGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/auth/entities/auth.entity';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  ccreateTaskreate(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get()
  getAllTask(@GetUser() user: User): Promise<Task[]> {
    return this.tasksService.getAllTask(user);
  }

  @Get('/all')
  QR() {
    return this.tasksService.QR()
  }

  @Get(':id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user); //+id if id is number
  }
}
