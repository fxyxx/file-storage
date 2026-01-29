import {
	Controller,
	Post,
	Patch,
	Get,
	Delete,
	UseInterceptors,
	UploadedFile,
	ParseFilePipe,
	MaxFileSizeValidator,
	UseGuards,
	Query,
	Param,
	Body,
	ParseIntPipe,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { RenameFileDto, UploadFileQueryDto } from './dto/files.dto';

@ApiTags('Files')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('upload')
	@ApiOperation({ summary: 'Upload file (optionally to a folder)' })
	@UseInterceptors(FileInterceptor('file'))
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: { type: 'string', format: 'binary' },
			},
		},
	})
	async uploadFile(
		@UploadedFile(
			new ParseFilePipe({
				validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 50 })],
			}),
		)
		file: Express.Multer.File,
		@User('id') userId: number,
		@Query() query: UploadFileQueryDto,
	) {
		return this.filesService.create(file, userId, query.folderId);
	}

	@Delete()
	@ApiOperation({ summary: 'Delete files by ID (comma separated)' })
	async deleteFiles(@User('id') userId: number, @Query('ids') ids: string) {
		const idsArray = ids
			.split(',')
			.map((id) => parseInt(id))
			.filter((id) => !isNaN(id));
		return this.filesService.delete(userId, idsArray);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Rename file' })
	async renameFile(@User('id') userId: number, @Param('id', ParseIntPipe) id: number, @Body() dto: RenameFileDto) {
		return this.filesService.rename(userId, id, dto.name);
	}

	@Post(':id/copy')
	@ApiOperation({ summary: 'Create a copy of the file' })
	async copyFile(@User('id') userId: number, @Param('id', ParseIntPipe) id: number) {
		return this.filesService.copy(userId, id);
	}

	@Get(':id/view')
	@ApiOperation({ summary: 'Get a temporary viewing link' })
	async getFileView(@User('id') userId: number, @Param('id', ParseIntPipe) id: number) {
		return this.filesService.getPresignedUrl(userId, id);
	}
}
