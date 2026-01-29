import { IsEmail, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { ShareRole, ResourceType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class InviteUserDto {
	@ApiProperty({ enum: ResourceType, example: 'FOLDER' })
	@IsEnum(ResourceType)
	resourceType: ResourceType;

	@ApiProperty({ example: 123 })
	@IsInt()
	resourceId: number;

	@ApiProperty({ example: 'colleague@example.com' })
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ enum: ShareRole, example: 'VIEWER' })
	@IsEnum(ShareRole)
	role: ShareRole;
}

export class ChangeRoleDto {
	@ApiProperty({ enum: ShareRole })
	@IsEnum(ShareRole)
	role: ShareRole;
}
