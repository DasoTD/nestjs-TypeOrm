import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsString } from 'class-validator';
import { TaskStatus } from '../task.enum';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsEnum(TaskStatus)
  staus?: TaskStatus;
}
