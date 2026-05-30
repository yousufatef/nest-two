import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { accessTokenType, JwtPayloadType } from '../utils/types';

@Injectable()
export class AuthProvider {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,

    ) { }

    private async generateJwtToken(user: User) {
        const payload: JwtPayloadType = { id: user.id, userType: user.userType };
        return await this.jwtService.signAsync(payload);
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


}
