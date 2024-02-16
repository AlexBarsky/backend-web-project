import { faker } from '@faker-js/faker';
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto);

		return await this.returnFields(user);
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken);

		if (!result) throw new UnauthorizedException('Invalid refresh token');

		const user = await this.prisma.user.findUnique({
			where: {
				id: result.id,
			},
		});

		if (!user) throw new NotFoundException('User not found');

		return await this.returnFields(user);
	}

	async register(dto: AuthDto) {
		const existingUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});

		if (existingUser)
			throw new BadRequestException('User with this email already exists');

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				name: faker.person.firstName(), //name is deprecated
				avatar_path: faker.image.avatar(),
				phone: faker.phone.number('+7(###)### ##-##'), //.phone.number() instead of .string.numeric()
				password: await hash(dto.password),
			},
		});

		return await this.returnFields(user);
	}

	private async issueTokens(userId: number) {
		const data = { id: userId };

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h',
		});

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d',
		});

		return { accessToken, refreshToken };
	}

	private async returnFields(user: user) {
		const tokens = await this.issueTokens(user.id);

		return {
			id: user.id,
			email: user.email,
			...tokens,
		};
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});

		if (!user) throw new NotFoundException('User not found');

		const isValid = await verify(user.password, dto.password);

		if (!isValid) throw new UnauthorizedException('Invalid password');

		return user;
	}
}
