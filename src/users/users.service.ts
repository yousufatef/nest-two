import { AuthProvider } from './auth.provider';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserProfile } from '../utils/types';
import { UserType } from '../utils/enums';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly AuthProvider: AuthProvider,
    private readonly jwtService: JwtService,

  ) { }


  async update(id: number, updateUserDto: UpdateUserDto) {
    const { username, password } = updateUserDto;
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      if (username) user.username = username;
      if (password) {
        user.password = await this.hashPassword(password);
      }
      await this.userRepository.save(user);
      return { message: 'User updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.id === id || user.userType === UserType.ADMIN) {
      await this.userRepository.delete(id);
      return { message: 'User removed successfully' };
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async getCurrentUser(id: number): Promise<UserProfile> {


    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;

  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

}
