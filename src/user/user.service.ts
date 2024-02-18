import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { returnUserObject } from './return-user.object';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async byIdOrEmail(
		idOrEmail: number | string,
		selectObject: Prisma.userSelect = {},
	) {
		const whereCondition =
			typeof idOrEmail === 'number' ? { id: idOrEmail } : { email: idOrEmail };

		const user = await this.prisma.user.findUnique({
			where: whereCondition,
			select: {
				...returnUserObject,
				favorites: {
					select: {
						id: true,
						name: true,
						slug: true,
						price: true,
						imgs: true,
					},
				},
				...selectObject,
			},
		});

		return user;
	}

	/**TODO:
	 * Check later, how user updates his profile
	 * Take a look at function once more for probable optimization
	 */
	async updateProfile(id: number, dto: UserDto) {
		const isSameUser = await this.byIdOrEmail(dto.email);

		if (isSameUser && isSameUser.id !== id)
			throw new BadRequestException('Email already in use');

		const user = await this.byIdOrEmail(id);

		return this.prisma.user.update({
			where: {
				id,
			},
			data: {
				email: dto.email,
				name: dto.name,
				avatar_path: dto.avatarPath,
				phone: dto.phone,
				password: dto.password ? await hash(dto.password) : user.password,
			},
		});
	}

	async toggleFavorite(id: number, productId: number) {
		const user = await this.byIdOrEmail(id);

		if (!user) throw new NotFoundException('User not found by ID');

		const isExists = user.favorites.some(product => product.id === productId);

		await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				favorites: {
					[isExists ? 'disconnect' : 'connect']: {
						id: productId,
					},
				},
			},
		});

		return { message: 'Success' };
	}
}
