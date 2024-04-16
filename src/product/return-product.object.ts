import { Prisma } from '@prisma/client';
import { returnCategoryObject } from 'src/category/return-category.object';
import { returnReviewObject } from 'src/review/return-review.object';

export const returnProductObject: Prisma.productSelect = {
	id: true,
	created_at: true,
	name: true,
	slug: true,
	description: true,
	price: true,
	imgs: true,
	reviews: {
		select: returnReviewObject,
	},
	category: {
		select: returnCategoryObject,
	},
};

export const returnProductObjectFullest: Prisma.productSelect = {
	...returnProductObject,
};
