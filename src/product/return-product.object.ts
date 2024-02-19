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
};

export const returnProductObjectFullest: Prisma.productSelect = {
	...returnProductObject,
	review: {
		select: returnReviewObject,
	},
	category: {
		select: returnCategoryObject,
	},
};
