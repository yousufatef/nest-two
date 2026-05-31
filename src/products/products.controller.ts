import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthRoleGuard } from '../users/guards/auth-role.guard';
import { Roles } from '../users/decorators/user-role.decorator';
import { UserType } from '../utils/enums';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import type { JwtPayloadType } from '../utils/types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post("create-product")
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  create(@Body() createProductDto: CreateProductDto, @CurrentUser() payload: JwtPayloadType) {
    return this.productsService.createProduct(createProductDto, payload.id);
  }

  @Get()
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  getAllProducts(
    @Query("title") title: string,
    @Query("minPrice") minPrice: string,
    @Query("maxPrice") maxPrice: string
  ) {
    return this.productsService.getAllProducts(title, minPrice, maxPrice);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getProductById(id);
  }

  @Put(':id')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthRoleGuard)
  @Roles(UserType.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.productsService.remove(id);
    return `This product with ID ${id} has been removed.`;
  }
}
