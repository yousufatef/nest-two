import { IsNotEmpty, IsNumber, IsString, Max, Min, MinLength } from "class-validator";

export class CreateReviewDto {

    @IsNumber()
    @IsNotEmpty()
    @Min(1, { message: 'Rating must be at least 1' })
    @Max(5, { message: 'Rating must be at most 5' })
    rating!: number;

    @IsString()
    @MinLength(10, { message: 'Comment must be at least 10 characters long' })
    comment!: string
}
