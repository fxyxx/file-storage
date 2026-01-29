import { Controller, Get, Post, Body, Query, UseGuards, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';

@ApiTags('Folders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('folders')
export class FoldersController {
	constructor(private readonly foldersService: FoldersService) {}

	@Post()
	@ApiOperation({ summary: 'Create a folder' })
	create(@User('id') userId: number, @Body() createFolderDto: CreateFolderDto) {
		return this.foldersService.create(userId, createFolderDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get the contents of a folder (or root)' })
	@ApiQuery({ name: 'parentId', required: false, type: Number })
	findAll(@User('id') userId: number, @Query('parentId') parentId?: string) {
		const parsedParentId = parentId ? parseInt(parentId) : null;
		return this.foldersService.findAllByParent(userId, isNaN(parsedParentId!) ? null : parsedParentId);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get information about a folder with a path' })
	findOne(@User('id') userId: number, @Param('id', ParseIntPipe) id: number) {
		return this.foldersService.findOne(userId, id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Rename folder' })
	rename(@User('id') userId: number, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFolderDto) {
		return this.foldersService.rename(userId, id, dto.name);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete folder (recursively)' })
	remove(@User('id') userId: number, @Param('id', ParseIntPipe) id: number) {
		return this.foldersService.remove(userId, id);
	}
}
