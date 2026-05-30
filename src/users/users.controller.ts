import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import type { JwtPayloadType } from '../utils/types';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/user-role.decorator';
import { UserType } from '../utils/enums';
import { AuthRoleGuard } from './guards/auth-role.guard';
import { AuthProvider } from './auth.provider';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService
    , private readonly authService: AuthProvider
  ) { }


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
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('auth/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
    console.log('Current user payload works');
    return this.usersService.getCurrentUser(payload.id);
  }
}
