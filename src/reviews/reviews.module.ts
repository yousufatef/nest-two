import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), ProductsModule, UsersModule, JwtModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule { }
