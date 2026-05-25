import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {  IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
   
    @Length(2, 150)
    @IsString()
    @IsOptional()
    username!: string;

    @IsString()
    @Length(8, 128)
    @IsOptional()
    password!: string;
}
