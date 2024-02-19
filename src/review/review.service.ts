import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewDto } from './dto/review.dto';
import { returnReviewObject } from './return-review.object';

@Injectable()
export class ReviewService {
	constructor(private prisma: PrismaService) {}

	/**
	 * TODO:
	 * Check product existence
	 */
	async create(userId: number, dto: ReviewDto, productId: number) {
		return this.prisma.review.create({
			data: {
				...dto,
				product: {
					connect: {
						id: productId,
					},
				},
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});
	}

	async getAll() {
		return this.prisma.review.findMany({
			orderBy: {
				created_at: 'desc',
			},
			select: returnReviewObject,
		});
	}

	async getAverageValueByProductId(productId: number) {
		return this.prisma.review
			.aggregate({
				where: { id: productId },
				_avg: { rating: true },
			})
			.then(data => data._avg);
	}

	// async delete(id: number) {
	// 	return this.prisma.review.delete({
	// 		where: {
	// 			id,
	// 		},
	// 	});
	// }
}
