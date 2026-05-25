import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email!: string;

    @IsNotEmpty()
    @MaxLength(6)
    @IsString()
    password!: string;
}