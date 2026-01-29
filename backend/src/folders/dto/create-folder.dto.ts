import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFolderDto {
	@ApiProperty({ example: 'New Project', description: 'Folder name' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	name: string;

	@ApiProperty({ example: 10, required: false, description: 'Parent folder ID (null for root)' })
	@IsOptional()
	@IsNumber()
	parentId?: number;
}
