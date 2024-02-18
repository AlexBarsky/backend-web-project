import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { user } from '@prisma/client';

export const CurrentUser = createParamDecorator(
	(data: keyof user, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user;

		return data ? user[data] : user;
	},
);
