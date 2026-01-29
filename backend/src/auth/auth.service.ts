import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	async register(dto: RegisterDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (oldUser) {
			throw new BadRequestException('User with this email already exists');
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(dto.password, salt);

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: hashedPassword,
				fullName: dto.fullName,
			},
		});

		return this.generateToken(user.id, user.email);
	}

	async login(dto: LoginDto) {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (!user) {
			throw new UnauthorizedException('Login or password is incorrect');
		}

		const isValidPassword = await bcrypt.compare(dto.password, user.password);

		if (!isValidPassword) {
			throw new UnauthorizedException('Login or password is incorrect');
		}

		return this.generateToken(user.id, user.email);
	}

	private async generateToken(userId: number, email: string) {
		const payload = { sub: userId, email };

		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
