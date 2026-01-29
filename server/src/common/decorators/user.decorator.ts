import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface RequestUser {
	id: number;
	email: string;
}

export const User = createParamDecorator(
	(data: keyof RequestUser | undefined, ctx: ExecutionContext): RequestUser | number | string => {
		const request = ctx.switchToHttp().getRequest<{ user: RequestUser }>();
		const user = request.user;

		return data ? user?.[data] : user;
	},
);
