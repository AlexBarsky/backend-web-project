import { Prisma } from '@prisma/client';

export const returnUserObject: Prisma.userSelect = {
	id: true,
	name: true,
	email: true,
	password: false,
	avatar_path: true,
	phone: true,
};
