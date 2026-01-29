import {
	ForbiddenException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PermissionsService } from '../permissions/permissions.service';
import { FilesRepository } from './files.repository';
import { STORAGE_PROVIDER, StorageProvider } from '../storage';
import { File } from '@prisma/client';

@Injectable()
export class FilesService {
	constructor(
		@Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
		private readonly filesRepository: FilesRepository,
		private readonly permissionsService: PermissionsService,
	) {}

	async create(file: Express.Multer.File, userId: number, folderId?: number) {
		if (folderId) {
			const hasAccess = await this.permissionsService.checkAccess(userId, folderId, 'FOLDER', 'EDITOR');
			if (!hasAccess) {
				throw new ForbiddenException('You do not have permission to upload files to this folder.');
			}
		}

		const s3Key = `${uuidv4()}-${file.originalname}`;

		try {
			await this.storage.upload({
				key: s3Key,
				body: file.buffer,
				contentType: file.mimetype,
			});
		} catch (error) {
			console.error('Storage Upload Error:', error);
			throw new InternalServerErrorException('Error uploading file to storage');
		}

		try {
			return await this.filesRepository.create({
				filename: s3Key,
				originalName: file.originalname,
				size: file.size,
				mimetype: file.mimetype,
				s3Path: s3Key,
				userId: userId,
				folderId: folderId || null,
			});
		} catch (error) {
			try {
				await this.storage.delete([s3Key]);
			} catch (rollbackError) {
				console.error('Rollback Error (storage delete):', rollbackError);
			}
			console.error('File Metadata Save Error:', error);
			throw new InternalServerErrorException('Error saving file metadata');
		}
	}

	async delete(userId: number, fileIds: number[]) {
		const files = await this.filesRepository.findByIds(fileIds);

		if (files.length === 0) return { count: 0 };

		const allowedFiles: File[] = [];

		for (const file of files) {
			const canDelete = await this.permissionsService.checkAccess(userId, file.id, 'FILE', 'EDITOR');
			if (canDelete) {
				allowedFiles.push(file);
			}
		}

		if (allowedFiles.length === 0) {
			throw new ForbiddenException('You do not have permission to delete the selected files.');
		}

		try {
			await this.storage.delete(allowedFiles.map((f) => f.s3Path));
		} catch (e) {
			console.error('Storage Delete Error (Non-blocking):', e);
		}

		const result = await this.filesRepository.deleteMany(allowedFiles.map((f) => f.id));

		return { success: true, deletedCount: result.count };
	}

	async rename(userId: number, fileId: number, newName: string) {
		const canEdit = await this.permissionsService.checkAccess(userId, fileId, 'FILE', 'EDITOR');
		if (!canEdit) {
			throw new ForbiddenException('You do not have permission to edit the file.');
		}

		return this.filesRepository.update(fileId, { originalName: newName });
	}

	async copy(userId: number, fileId: number) {
		const file = await this.filesRepository.findById(fileId);
		if (!file) throw new NotFoundException('File not found');

		const canRead = await this.permissionsService.checkAccess(userId, fileId, 'FILE');
		if (!canRead) throw new ForbiddenException('File access denied');

		if (file.folderId) {
			const canWriteToFolder = await this.permissionsService.checkAccess(
				userId,
				file.folderId,
				'FOLDER',
				'EDITOR',
			);
			if (!canWriteToFolder)
				throw new ForbiddenException('You do not have permission to create files in this folder.');
		}

		const newS3Key = `${uuidv4()}-${file.originalName}`;

		try {
			await this.storage.copy(file.s3Path, newS3Key);
		} catch (error) {
			console.error('Storage Copy Error:', error);
			throw new InternalServerErrorException('Error copying file in storage');
		}

		try {
			return await this.filesRepository.create({
				filename: newS3Key,
				originalName: `${file.originalName} (Copy)`,
				size: file.size,
				mimetype: file.mimetype,
				s3Path: newS3Key,
				userId: userId,
				folderId: file.folderId,
			});
		} catch (error) {
			try {
				await this.storage.delete([newS3Key]);
			} catch (rollbackError) {
				console.error('Rollback Error (storage delete):', rollbackError);
			}
			console.error('Copy Metadata Save Error:', error);
			throw new InternalServerErrorException('Error saving copied file metadata');
		}
	}

	async getPresignedUrl(userId: number, fileId: number) {
		const file = await this.filesRepository.findById(fileId);
		if (!file) throw new NotFoundException('File not found');

		const canView = await this.permissionsService.checkAccess(userId, fileId, 'FILE');
		if (!canView) throw new ForbiddenException('File access denied');

		try {
			const result = await this.storage.getPresignedUrl(file.s3Path, {
				contentDisposition: 'inline',
				contentType: file.mimetype,
				expiresIn: 3600,
			});

			return {
				url: result.url,
				name: file.originalName,
				mimetype: file.mimetype,
				size: file.size,
			};
		} catch (error) {
			console.error('Presigned URL Error:', error);
			throw new InternalServerErrorException('Link generation error');
		}
	}
}
