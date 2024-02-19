import { Prisma } from '@prisma/client';
import { returnUserObject } from 'src/user/return-user.object';

export const returnReviewObject: Prisma.reviewSelect = {
	id: true,
	created_at: true,
	text: true,
	rating: true,
	user: {
		select: returnUserObject,
	},
};
