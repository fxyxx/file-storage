import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
	@IsEmail({}, { message: 'Invalid email address' })
	email: string;

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	password: string;

	@IsOptional()
	@IsString()
	fullName?: string;
}

export class LoginDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;
}
