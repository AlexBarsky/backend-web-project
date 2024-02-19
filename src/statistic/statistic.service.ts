import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
	) {}

	/**
	 * TODO:
	 * Add total amount using SQL query
	 */
	async getMain(userId: number) {
		const user = await this.userService.byIdOrEmail(userId, {
			order: {
				select: {
					order_item: true,
				},
			},
			review: true,
		});

		return [
			{
				name: 'Order',
				value: user.order.length,
			},
			{
				name: 'Reviews',
				value: user.review.length,
			},
			{
				name: 'Favorites',
				value: user.favorites.length,
			},
			{
				name: 'Total amount',
				value: 1000,
			},
		];
	}
}
