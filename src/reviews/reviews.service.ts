import { UsersService } from './../users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ProductsService } from '../products/products.service';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { JwtPayloadType } from '../utils/types';
import { UserType } from '../utils/enums';

@Injectable()
export class ReviewsService {

  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly UsersService: UsersService,
    private readonly ProductsService: ProductsService,
  ) { }

  async createReview(dto: CreateReviewDto, productId: number, userId: number) {
    const user = await this.UsersService.getCurrentUser(userId);
    const product = await this.ProductsService.getProductById(productId);

    if (!user) {
      throw new Error('User not found');
    }
    if (!product) {
      throw new Error('Product not found');
    }

    const review = this.reviewsRepository.create({
      ...dto,
      user,
      product,
    });
    await this.reviewsRepository.save(review);
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      userId
    }
  }

  async GetAllReviews() {
    return await this.reviewsRepository.find({ order: { created_at: 'DESC' } });
  }

  async getReviewById(id: number) {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId: number) {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    review.rating = updateReviewDto.rating ?? review.rating;
    review.comment = updateReviewDto.comment ?? review.comment;
    await this.reviewsRepository.save(review);
    return review;
  }

  async remove(id: number, payload: JwtPayloadType) {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    if (review.user.id === payload.id || payload.userType === UserType.ADMIN) {
      await this.reviewsRepository.remove(review);
    }
    return { message: `Review with ID ${id} removed` };
  }
}
