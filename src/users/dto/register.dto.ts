import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from "class-validator";

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(250)
    email!: string;

    @Length(2, 150)
    @IsString()
    @IsOptional()
    username!: string;

    @IsNotEmpty()
    @MaxLength(6)
    @IsString()
    password!: string;
}