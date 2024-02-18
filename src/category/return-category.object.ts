import { Prisma } from '@prisma/client';

export const returnCategoryObject: Prisma.categorySelect = {
	id: true,
	name: true,
	slug: true,
};
