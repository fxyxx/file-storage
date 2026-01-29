export interface UploadParams {
	key: string;
	body: Buffer;
	contentType: string;
}

export interface UploadResult {
	key: string;
	success: boolean;
}

export interface PresignedUrlOptions {
	expiresIn?: number;
	contentDisposition?: string;
	contentType?: string;
}

export interface PresignedUrlResult {
	url: string;
	expiresIn: number;
}

export abstract class StorageProvider {
	abstract upload(params: UploadParams): Promise<UploadResult>;
	abstract delete(keys: string[]): Promise<void>;
	abstract copy(sourceKey: string, destKey: string): Promise<string>;
	abstract getPresignedUrl(key: string, options?: PresignedUrlOptions): Promise<PresignedUrlResult>;
}
