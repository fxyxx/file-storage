import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@ApiOperation({ summary: 'User registration' })
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@Post('login')
	@ApiOperation({ summary: 'User login' })
	async login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}
}
