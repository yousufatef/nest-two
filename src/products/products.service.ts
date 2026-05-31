import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly usersService: UsersService,
  ) { }


  async createProduct(createProductDto: CreateProductDto, userId: number) {
    const user = await this.usersService.getCurrentUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      title: createProductDto.title?.toLowerCase(),
      user
    });
    await this.productRepository.save(product);
    return product;
  }

  async getAllProducts(title?: string, minPrice?: string, maxPrice?: string) {
    const filters: any = {};

    if (title) {
      filters.title = ILike(`%${title}%`);
    }

    if (minPrice && maxPrice) {
      filters.price = Between(parseFloat(minPrice), parseFloat(maxPrice));
    } else if (minPrice) {
      filters.price = MoreThanOrEqual(parseFloat(minPrice));
    } else if (maxPrice) {
      filters.price = LessThanOrEqual(parseFloat(maxPrice));
    }

    return this.productRepository.find({ where: filters });
  }

  async getProductById(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    product.title = updateProductDto.title ?? product.title;
    product.description = updateProductDto.description ?? product.description;
    product.price = updateProductDto.price ?? product.price;

    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return await this.productRepository.remove(product);
  }


}
