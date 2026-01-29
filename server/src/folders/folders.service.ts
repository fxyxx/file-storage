import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionsService } from '../permissions/permissions.service';
import { FoldersRepository } from './folders.repository';
import { FilesRepository } from '../files/files.repository';
import { STORAGE_PROVIDER, StorageProvider } from '../storage';

@Injectable()
export class FoldersService {
	private readonly logger = new Logger(FoldersService.name);

	constructor(
		private readonly prisma: PrismaService,
		private readonly permissionsService: PermissionsService,
		private readonly foldersRepository: FoldersRepository,
		private readonly filesRepository: FilesRepository,
		@Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
	) {}

	async create(userId: number, dto: CreateFolderDto) {
		if (dto.parentId) {
			const hasAccess = await this.permissionsService.checkAccess(userId, dto.parentId, 'FOLDER', 'EDITOR');
			if (!hasAccess) {
				throw new ForbiddenException('You do not have permission to create a folder in this directory.');
			}
		}

		try {
			return await this.prisma.folder.create({
				data: {
					name: dto.name,
					parentId: dto.parentId || null,
					userId: userId,
				},
			});
		} catch (e: unknown) {
			if (e instanceof Error && 'code' in e && e.code === 'P2002') {
				throw new BadRequestException('A folder with this name already exists.');
			}
			throw e;
		}
	}

	async findAllByParent(userId: number, parentId: number | null) {
		if (parentId === null) {
			const [folders, files] = await Promise.all([
				this.foldersRepository.findByParentId(null, userId),
				this.filesRepository.findByFolderId(null, userId),
			]);
			const fileItems = files.map((f) => ({ ...f, type: 'FILE' }));
			const folderItems = folders.map((f) => ({ ...f, type: 'FOLDER' }));

			return { folders: folderItems, files: fileItems, role: 'OWNER' };
		}

		const hasAccess = await this.permissionsService.checkAccess(userId, parentId, 'FOLDER'); // Viewer ok
		if (!hasAccess) {
			throw new ForbiddenException('You cannot access this folder.');
		}

		const [folders, files] = await Promise.all([
			this.foldersRepository.findByParentId(parentId),
			this.filesRepository.findByFolderId(parentId),
		]);

		const fileItems = files.map((f) => ({ ...f, type: 'FILE' }));
		const folderItems = folders.map((f) => ({ ...f, type: 'FOLDER' }));

		return { folders: folderItems, files: fileItems };
	}

	async findOne(userId: number, folderId: number) {
		const access = await this.permissionsService.checkAccess(userId, folderId, 'FOLDER');
		if (!access) throw new ForbiddenException('Folder not available');

		const folder = await this.prisma.folder.findUnique({ where: { id: folderId } });
		if (!folder) throw new NotFoundException('Folder not found');

		const path = await this.permissionsService.getAncestorsPath(folderId, 'FOLDER');

		return { ...folder, path };
	}

	async remove(userId: number, folderId: number) {
		const canDelete = await this.permissionsService.checkAccess(userId, folderId, 'FOLDER', 'EDITOR');
		if (!canDelete) {
			throw new ForbiddenException('You do not have permission to delete this folder.');
		}

		const s3Keys = await this.foldersRepository.findAllS3KeysInFolderRecursively(folderId);
		this.logger.log(`Deleting folder ${folderId}, found ${s3Keys.length} S3 keys: ${JSON.stringify(s3Keys)}`);

		// Delete folder from database first (cascade deletes files records)
		await this.prisma.folder.delete({
			where: { id: folderId },
		});

		// Then delete files from S3 storage
		if (s3Keys.length > 0) {
			try {
				await this.storage.delete(s3Keys);
				this.logger.log(`Successfully deleted ${s3Keys.length} files from S3`);
			} catch (error) {
				this.logger.error(`Failed to delete files from S3: ${error}`);
				// Record for later cleanup if immediate deletion fails
				await this.prisma.recordDeletedS3Keys(s3Keys);
			}
		}

		return { message: 'The folder and all contents have been deleted.' };
	}

	async rename(userId: number, folderId: number, newName: string) {
		const canEdit = await this.permissionsService.checkAccess(userId, folderId, 'FOLDER', 'EDITOR');
		if (!canEdit) throw new ForbiddenException('No rights to rename');

		try {
			return await this.prisma.folder.update({
				where: { id: folderId },
				data: { name: newName },
			});
		} catch (e: unknown) {
			if (e instanceof Error && 'code' in e && e.code === 'P2002')
				throw new BadRequestException('The name is taken');
			throw e;
		}
	}
}
