import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type JwtPayload = {
	sub: number;
	email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		const jwtSecret = configService.get<string>('JWT_SECRET');

		if (!jwtSecret) {
			throw new Error('JWT_SECRET is not defined in environment variables');
		}

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtSecret,
		});
	}

	validate(payload: JwtPayload) {
		return { id: payload.sub, email: payload.email };
	}
}
