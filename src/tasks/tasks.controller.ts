import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { TaskStatus } from './tasks.status.enum';
import {Task} from './task.entity';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger("TasksController");

  constructor(private taskService: TasksService) { }

  @Get()
  getTasks(@Query(ValidationPipe) filterDto:GetTaskFilterDto,
  @GetUser() user:User): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all task. Filters: ${JSON.stringify(filterDto)}`);
    return this.taskService.getTasks(filterDto,user);
  }

  @Get(":id")
  getTaskById(@Param('id', ParseIntPipe) id: number,@GetUser() user:User): Promise<Task> {
    return this.taskService.getTaskById(id, user)
  }
  @Delete(":id")
  deleteTaskById(@Param('id',ParseIntPipe) id: number, @GetUser() user: User): void {
    this.taskService.deleteTaskById(id, user)
  }
  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @GetUser() user: User,
    @Body() createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.verbose(`User "${user.username}" creating a task. Filters: ${JSON.stringify(createTaskDto)}`);
    return this.taskService.createTask(createTaskDto, user)

  }
  @Patch(":id/status")
  updateTaskStatus(@Param("id",ParseIntPipe) id:number, @Body('status', TaskStatusValidationPipe) status:TaskStatus, @GetUser() user: User):Promise<Task>{
    return this.taskService.updateTaskStatus(id ,status, user);
  }

}
