import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetAllProductDto } from './dto/get-all.products.dto';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: GetAllProductDto) {
		return this.productService.getAll(queryDto);
	}

	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		return this.productService.getSimilar(+id);
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.productService.bySlug(slug);
	}

	@Get('by-category/:categorySlug')
	async getByCategory(@Param('categorySlug') categorySlug: string) {
		return this.productService.byCategory(categorySlug);
	}

	@Auth()
	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.productService.byId(+id);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async create() {
		return this.productService.create();
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(+id, dto);
	}

	@HttpCode(200)
	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.productService.delete(+id);
	}
}
