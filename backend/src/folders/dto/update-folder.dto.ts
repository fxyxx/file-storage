import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateFolderDto {
	@ApiProperty({ example: 'Renamed Folder', description: 'New folder name' })
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	name: string;
}
