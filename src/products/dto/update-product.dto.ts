import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { Min, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    @Length(2, 150)
    title!: string;


    @IsString()
    description!: string;

    @IsNumber()
    @Min(0, { message: 'Price must be a non-negative number' })
    price!: number;
}
