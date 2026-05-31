import { UsersService } from './../users/users.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from '../users/decorators/user-role.decorator';
import { AuthRoleGuard } from '../users/guards/auth-role.guard';
import { UserType } from '../utils/enums';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import type { JwtPayloadType } from '../utils/types';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
  ) { }

  @Post(':productId')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  createNewReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() payload: JwtPayloadType
  ) {
    return this.reviewsService.createReview(createReviewDto, productId, payload.id);
  }

  @Get()
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  GetAllReviews() {
    return this.reviewsService.GetAllReviews();
  }

  @Get(':id')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  getReviewById(@Param('id') id: number) {
    return this.reviewsService.getReviewById(id);
  }

  @Put(':id')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  update(@Param('id') id: number, @Body() updateReviewDto: UpdateReviewDto, @CurrentUser() payload: JwtPayloadType) {
    return this.reviewsService.update(id, updateReviewDto, payload.id);
  }

  @Delete(':id')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  remove(@Param('id') id: number, @CurrentUser() payload: JwtPayloadType) {
    return this.reviewsService.remove(id, payload);
  }
}
