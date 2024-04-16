import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { generateSlug } from 'src/util/generate-slug';
import { EnumProductSort, GetAllProductDto } from './dto/get-all.products.dto';
import { ProductDto } from './dto/product.dto';
import {
	returnProductObject,
	returnProductObjectFullest,
} from './return-product.object';

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService,
	) {}

	async getAll(dto: GetAllProductDto = {}) {
		const { sort, searchTerm } = dto;

		const prismaSort: Prisma.productOrderByWithRelationInput[] = [];

		if (sort === EnumProductSort.HIGH_PRICE) {
			prismaSort.push({ price: 'desc' });
		} else if (sort === EnumProductSort.LOW_PRICE) {
			prismaSort.push({ price: 'asc' });
		} else if (sort === EnumProductSort.OLDEST) {
			prismaSort.push({ created_at: 'asc' });
		} else {
			prismaSort.push({ created_at: 'desc' });
		}

		const prismaSearchTermFilter: Prisma.productWhereInput = searchTerm
			? {
					OR: [
						{
							category: {
								name: {
									contains: searchTerm,
									mode: 'insensitive',
								},
							},
						},
						{
							name: {
								contains: searchTerm,
								mode: 'insensitive',
							},
						},
						{
							description: {
								contains: searchTerm,
								mode: 'insensitive',
							},
						},
					],
				}
			: {};

		const { perPage, skip } = this.paginationService.getPagination(dto);

		const products = await this.prisma.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage,
			select: returnProductObject,
		});

		return {
			products,
			length: await this.prisma.product.count({
				where: prismaSearchTermFilter,
			}),
		};
	}

	async byId(id: number) {
		const product = await this.prisma.product.findUnique({
			where: {
				id,
			},
			select: returnProductObjectFullest,
		});

		if (!product) throw new NotFoundException('Product not found by ID');

		return product;
	}

	async bySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				slug,
			},
			select: returnProductObjectFullest,
		});

		if (!product) throw new NotFoundException('Product not found by Slug');

		return product;
	}

	async byCategory(categorySlug: string) {
		const products = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug,
				},
			},
			select: returnProductObjectFullest,
		});

		if (!products) throw new NotFoundException('Product not found by Category');

		return products;
	}

	async getSimilar(id: number) {
		const currentProduct = await this.byId(id);

		if (!currentProduct)
			throw new NotFoundException('Current product not found');

		const products = await this.prisma.product.findMany({
			where: {
				category: {
					name: currentProduct.category.name,
				},
				NOT: {
					id: currentProduct.id,
				},
			},
			orderBy: {
				created_at: 'desc',
			},
			select: returnProductObject,
		});

		return products;
	}

	async create() {
		const product = await this.prisma.product.create({
			data: {
				name: '',
				slug: '',
				description: '',
				price: 0,
			},
		});

		return product.id;
	}

	async update(id: number, dto: ProductDto) {
		const { name } = dto;

		return this.prisma.product.update({
			where: {
				id,
			},
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				description: dto.description,
				price: dto.price,
				imgs: dto.images,
				category: {
					connect: {
						id: dto.categoryId,
					},
				},
			},
		});
	}

	async delete(id: number) {
		return this.prisma.product.delete({
			where: {
				id,
			},
		});
	}
}
