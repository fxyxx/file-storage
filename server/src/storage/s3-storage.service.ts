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
	private readonly s3PublicClient: S3Client;
	private readonly bucket: string;

	constructor(private readonly configService: ConfigService) {
		super();
		this.bucket = this.configService.getOrThrow<string>('AWS_BUCKET');
		const region = this.configService.getOrThrow<string>('AWS_REGION');
		const credentials = {
			accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
			secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
		};
		const internalEndpoint = this.configService.getOrThrow<string>('AWS_ENDPOINT');
		const publicEndpoint = this.configService.get<string>('AWS_PUBLIC_ENDPOINT') || internalEndpoint;

		this.s3Client = new S3Client({
			region,
			credentials,
			endpoint: internalEndpoint,
			forcePathStyle: true,
		});

		this.s3PublicClient = new S3Client({
			region,
			credentials,
			endpoint: publicEndpoint,
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

		const url = await getSignedUrl(this.s3PublicClient, command, { expiresIn });

		return { url, expiresIn };
	}
}
