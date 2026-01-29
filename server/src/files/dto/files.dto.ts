import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class RenameFileDto {
	@ApiProperty({ example: 'new-project-name.pdf' })
	@IsString()
	@IsNotEmpty()
	name: string;
}

export class UploadFileQueryDto {
	@ApiProperty({ required: false, description: 'ID of the folder where we are uploading' })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	folderId?: number;
}
