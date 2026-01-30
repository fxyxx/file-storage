import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectsCommand,
	CopyObjectCommand,
	GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageProvider, UploadParams, UploadResult, PresignedUrlOptions, PresignedUrlResult } from './storage.types';

@Injectable()
export class S3StorageService extends StorageProvider {
	private readonly s3Client: S3Client;
	private readonly bucket: string;
	private readonly internalEndpoint: string;
	private readonly publicEndpoint: string;

	constructor(private readonly configService: ConfigService) {
		super();
		this.bucket = this.configService.getOrThrow<string>('AWS_BUCKET');
		const region = this.configService.getOrThrow<string>('AWS_REGION');
		this.internalEndpoint = this.configService.getOrThrow<string>('AWS_ENDPOINT');
		this.publicEndpoint = this.configService.get<string>('AWS_PUBLIC_ENDPOINT') || this.internalEndpoint;

		this.s3Client = new S3Client({
			region,
			credentials: {
				accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
				secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
			},
			endpoint: this.internalEndpoint,
			forcePathStyle: true,
		});
	}

	async upload(params: UploadParams): Promise<UploadResult> {
		await this.s3Client.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: params.key,
				Body: params.body,
				ContentType: params.contentType,
			}),
		);

		return { key: params.key, success: true };
	}

	async delete(keys: string[]): Promise<void> {
		if (keys.length === 0) return;

		await this.s3Client.send(
			new DeleteObjectsCommand({
				Bucket: this.bucket,
				Delete: {
					Objects: keys.map((key) => ({ Key: key })),
				},
			}),
		);
	}

	async copy(sourceKey: string, destKey: string): Promise<string> {
		await this.s3Client.send(
			new CopyObjectCommand({
				Bucket: this.bucket,
				CopySource: encodeURI(`${this.bucket}/${sourceKey}`),
				Key: destKey,
			}),
		);

		return destKey;
	}

	async getPresignedUrl(key: string, options?: PresignedUrlOptions): Promise<PresignedUrlResult> {
		const expiresIn = options?.expiresIn ?? 3600;

		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: key,
			ResponseContentDisposition: options?.contentDisposition ?? 'inline',
			ResponseContentType: options?.contentType,
		});

		let url = await getSignedUrl(this.s3Client, command, { expiresIn });

		// Replace internal endpoint with public endpoint for browser access
		if (this.internalEndpoint !== this.publicEndpoint) {
			url = url.replace(this.internalEndpoint, this.publicEndpoint);
		}

		return { url, expiresIn };
	}
}
