import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import type { JwtPayloadType } from '../utils/types';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/user-role.decorator';
import { UserType } from '../utils/enums';
import { AuthRoleGuard } from './guards/auth-role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRoleGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }


  @Put(':id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRoleGuard)
  update(@CurrentUser() payload: JwtPayloadType, @Body() body: UpdateUserDto) {
    return this.usersService.update(payload.id, body);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRoleGuard)
  remove(@CurrentUser() payload: JwtPayloadType, @Param('id') id: string) {
    return this.usersService.remove(payload.id);
  }

  @Post('auth/register')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRoleGuard)
  register(@Body() registerDto: RegisterDto) {
    return this.usersService.register(registerDto);
  }

  @Post('auth/login')
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRoleGuard)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }


  @Get('current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() payload: JwtPayloadType) {
    return this.usersService.getCurrentUser(payload.id);
  }
}
