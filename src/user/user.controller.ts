import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  // @Patch('activate/:id')
  // async activateUser(@Param('id') id: string) {
  //   return this.userService.activateUser(id);
  // }

  @Patch('deactivate/:id')
  async deactivateUser(@Param('id') id: string) {
    return this.userService.deactivateUser(id);
  }

  @Patch('activate')
  async activateUser(@Query('token') token: string) {
    const user = await this.userService.activateUser(token);
    if (!user)
      throw new NotFoundException('Invalid or expired activation token');
    return { message: 'Account activated successfully' };
  }
}
