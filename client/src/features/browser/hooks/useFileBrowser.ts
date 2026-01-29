import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { type ChangeEvent, useRef } from 'react';
import { getContents } from '../api/contents';
import { getSharedWithMe } from '@/features/share';
import { useBrowserStore } from '../store/useBrowserStore';
import { useUploadStore } from '@/features/upload';

export const useFileBrowser = () => {
	const { folderId } = useParams<{ folderId: string }>();
	const navigate = useNavigate();

	const viewMode = useBrowserStore((state) => state.viewMode);
	const setViewMode = useBrowserStore((state) => state.setViewMode);
	const addUpload = useUploadStore((state) => state.addUpload);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const parsedFolderId = folderId ? parseInt(folderId) : null;
	const isRoot = parsedFolderId === null;

	const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			Array.from(files).forEach((file) => {
				addUpload(file, parsedFolderId);
			});
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const { data, isLoading, error } = useQuery({
		queryKey: ['files', parsedFolderId],
		queryFn: () => getContents(parsedFolderId),
	});

	const { data: sharedData, isLoading: sharedLoading } = useQuery({
		queryKey: ['shared-with-me'],
		queryFn: getSharedWithMe,
		enabled: isRoot,
	});

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleGoHome = () => {
		navigate('/');
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	return {
		parsedFolderId,
		isRoot,
		viewMode,
		setViewMode,
		fileInputRef,
		handleFileSelect,
		handleUploadClick,
		data,
		isLoading,
		error,
		sharedData,
		sharedLoading,
		handleGoBack,
		handleGoHome,
	};
};
