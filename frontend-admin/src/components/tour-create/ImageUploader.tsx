import { useState, useRef, useEffect } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { TiCloudStorage } from "react-icons/ti";


interface ImageUploaderProps {
    label?: string;
    maxFiles?: number;
    maxSizeMB?: number;
    value?: File[];
    onChange?: (files: File[]) => void;
    disabled?: boolean;
    error?: string;
}

const ImageUploader = ({
    label = "Chọn Ảnh",
    maxFiles = 10,
    maxSizeMB = 5,
    value = [],
    onChange,
    disabled = false,
    error,
}: ImageUploaderProps) => {
    const [dragOver, setDragOver] = useState(false);
    const [files, setFiles] = useState<File[]>(value);
    const [localError, setLocalError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync với value từ parent
    useEffect(() => {
        setFiles(value);
    }, [value]);

    const validateFiles = (newFiles: File[]): { isValid: boolean; message?: string } => {
        // Kiểm tra số lượng file
        if (files.length + newFiles.length > maxFiles) {
            return {
                isValid: false,
                message: `Tối đa ${maxFiles} ảnh được upload. Bạn đã chọn ${files.length} ảnh.`,
            };
        }

        // Kiểm tra kích thước file
        const maxSize = maxSizeMB * 1024 * 1024;
        const oversizedFiles = newFiles.filter((file) => file.size > maxSize);

        if (oversizedFiles.length > 0) {
            return {
                isValid: false,
                message: `Một số file vượt quá ${maxSizeMB}MB: ${oversizedFiles
                    .map((f) => f.name)
                    .join(", ")}`,
            };
        }

        // Kiểm tra định dạng
        const invalidFiles = newFiles.filter((file) => !file.type.startsWith("image/"));
        if (invalidFiles.length > 0) {
            return {
                isValid: false,
                message: `Chỉ chấp nhận file ảnh: ${invalidFiles.map((f) => f.name).join(", ")}`,
            };
        }

        return { isValid: true };
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files));
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        setLocalError("");

        if (e.dataTransfer.files) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFiles = (newFiles: File[]) => {
        const validation = validateFiles(newFiles);

        if (!validation.isValid) {
            setLocalError(validation.message || "File không hợp lệ");
            return;
        }

        setLocalError("");
        const imageFiles = newFiles.filter((file) => file.type.startsWith("image/"));
        const updated = [...files, ...imageFiles];

        setFiles(updated);
        onChange?.(updated);
    };

    const handleRemove = (idx: number) => {
        const updated = files.filter((_, i) => i !== idx);
        setFiles(updated);
        onChange?.(updated);
    };

    const handleClearAll = () => {
        setFiles([]);
        setLocalError("");
        onChange?.([]);
    };

    const displayError = error || localError;

    return (
        <div className="w-full">
            <label className="block font-medium mb-2">{label}</label>

            {/* Khu vực kéo thả */}
            <div
                className={`border ${
                    dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
                } border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                    disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-blue-500 hover:bg-blue-50"
                }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={disabled ? undefined : handleDrop}
                onClick={() => !disabled && fileInputRef.current?.click()}
            >
                <div className="text-gray-600">
                    {dragOver ? (
                        <div className="animate-pulse">
                            <div className="flex justify-center items-center mb-3">
                                <TiCloudStorage className="text-[50px] text-primary" />
                            </div>
                            <p className="text-blue-600 font-medium">Thả ảnh vào đây</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-center items-center mb-3">
                                <TiCloudStorage className="text-[50px] text-primary" />
                            </div>
                            <p className="text-gray-600 mb-2">
                                {disabled
                                    ? "Upload đã bị vô hiệu hóa"
                                    : "Click để chọn ảnh hoặc kéo-thả vào đây"}
                            </p>
                            <p className="text-sm text-gray-500">
                                Tối đa {maxFiles} ảnh, mỗi ảnh không quá {maxSizeMB}MB
                            </p>
                        </div>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={disabled}
                />
            </div>

            {/* Thông tin và nút xóa */}
            <div className="mt-3 flex justify-between items-center text-sm text-gray-600">
                <span>
                    Đã chọn: {files.length}/{maxFiles} ảnh
                </span>
                {files.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="text-red-500 hover:text-red-700"
                    >
                        Xóa tất cả
                    </button>
                )}
            </div>

            {/* Thông báo lỗi */}
            {displayError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                    {displayError}
                </div>
            )}

            {/* Hiển thị preview */}
            {files.length > 0 && (
                <div className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="relative group border rounded-lg overflow-hidden shadow-sm"
                            >
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${index}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(index);
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
