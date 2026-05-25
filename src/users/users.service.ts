import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { accessTokenType, JwtPayloadType, UserProfile } from '../utils/types';
import { ConfigService } from '@nestjs/config';
import { UserType } from '../utils/enums';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,

  ) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }


  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

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
    return { email: user.email, username: user.username, userType: user.userType, id: user.id, created_at: user.created_at, updated_at: user.updated_at, isAccountVerified: user.isAccountVerified };

  }

  async register(registerDto: RegisterDto): Promise<accessTokenType> {
    const { email, username, password } = registerDto;
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (user) {
        throw new BadRequestException('User already exists');
      }
      else {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = this.userRepository.create({ email, username, password: hashedPassword });
        await this.userRepository.save(newUser);

        // generate JWT token
        const accessToken = await this.generateJwtToken(newUser);
        return { accessToken };
      }
    } catch (error) {
      throw error;
    }
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async login(loginDto: LoginDto): Promise<accessTokenType> {
    const { email, password } = loginDto;
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new BadRequestException('Invalid credentials');
        }
        const accessToken = await this.generateJwtToken(user);
        return { accessToken };
      }
    } catch (error) {
      throw error;
    }
  }

  private async generateJwtToken(user: User) {
    const payload: JwtPayloadType = { id: user.id, userType: user.userType };
    return await this.jwtService.signAsync(payload);
  }
}
