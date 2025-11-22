import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import axios from 'axios';
import { API_CONFIG } from './api.config';

/**
 * Upload single image to Cloudinary via backend
 */
export const uploadSingleImage = async (file: File): Promise<string> => {
    try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error(`File ${file.name} is not an image`);
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error(`File ${file.name} is too large. Maximum size is 5MB`);
        }

        // Get auth token (check both localStorage and sessionStorage)
        let token = localStorage.getItem('token');
        if (!token) {
            token = sessionStorage.getItem('token');
        }
        if (!token) {
            throw new Error('User not authenticated');
        }

        // Create FormData
        const formData = new FormData();
        formData.append('image', file);

        // Upload to backend
        const response = await axios.post<{ success: boolean; message: string; data: { url: string } }>(
            `${API_CONFIG.baseURL}${API_ENDPOINTS.upload.reviewSingle}`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (response.data.success && response.data.data?.url) {
            return response.data.data.url;
        }

        throw new Error(response.data.message || 'Failed to upload image');
    } catch (error: any) {
        console.error('Error uploading single image:', error);
        throw error;
    }
};

/**
 * Upload multiple images to Cloudinary via backend
 */
export const uploadImages = async (files: File[]): Promise<string[]> => {
    try {
        if (files.length === 0) {
            return [];
        }

        // If only one file, use single upload
        if (files.length === 1) {
            const url = await uploadSingleImage(files[0]);
            return [url];
        }

        // Validate all files
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                throw new Error(`File ${file.name} is not an image`);
            }

            if (file.size > 5 * 1024 * 1024) {
                throw new Error(`File ${file.name} is too large. Maximum size is 5MB`);
            }
        }

        // Get auth token (check both localStorage and sessionStorage)
        let token = localStorage.getItem('token');
        if (!token) {
            token = sessionStorage.getItem('token');
        }
        if (!token) {
            throw new Error('User not authenticated');
        }

        // Create FormData
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        // Upload to backend
        const response = await axios.post<{ success: boolean; message: string; data: { images: { url: string }[] } }>(
            `${API_CONFIG.baseURL}${API_ENDPOINTS.upload.reviewMultiple}`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (response.data.success && response.data.data?.images) {
            return response.data.data.images.map((img) => img.url);
        }

        throw new Error(response.data.message || 'Failed to upload images');
    } catch (error: any) {
        console.error('Error uploading images:', error);
        throw error;
    }
};

/**
 * Convert File to base64 string (fallback method)
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Image upload service
 */
export const imageUploadService = {
    uploadImages,
    uploadSingleImage,
    fileToBase64,
};

