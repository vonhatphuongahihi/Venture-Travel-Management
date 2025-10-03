import { useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { TiCloudStorage } from "react-icons/ti";

type ImageUploaderProps = {
    label: string;
    onFilesChange?: (files: File[]) => void;
};

const ImageUploader = ({ label, onFilesChange }: ImageUploaderProps) => {
    const [dragOver, setDragOver] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files ) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFiles = (newFiles: File[]) => {
        const imageFiles = newFiles.filter((file) => file.type.startsWith("image/"));
        const updated = [...files, ...imageFiles];
        setFiles(updated);
        onFilesChange?.(updated);
    };

    const handleRemove = (idx: number) => {
        const updated = files.filter((_, i) => i !== idx);
        setFiles(updated);
        onFilesChange?.(updated);
    };

    return (
        <div className="w-full mx-auto">
            {/* Khu vực kéo thả */}
            <label className="block font-medium mb-2">{label}</label>
            <div
                className={`border ${
                    dragOver ? "border-primary" : "border-gray-500"
                } border-dashed rounded-md p-8 text-center cursor-pointer transition`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput")?.click()}
            >
                <div className="text-gray-600">
                    {dragOver ? (
                        <div className="">
                            <div className="flex justify-center items-center">
                                <TiCloudStorage className="text-[50px] text-blue-400" />
                            </div>
                            <p className="text-primary">Thả ảnh vào đây</p>
                        </div>
                    ) : (
                        <div className="">
                            <div className="flex justify-center items-center">
                                <TiCloudStorage className="text-[50px] text-primary" />
                            </div>
                            <p className="">Click để chọn ảnh hoặc kéo-thả ảnh vào đây</p>
                        </div>
                    )}
                </div>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Hiển thị preview */}
            <div className="grid grid-cols-4 gap-3 mt-4">
                {files.map((file, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={URL.createObjectURL(file)}
                            alt={`preview-${index}`}
                            className="w-full h-32 object-cover rounded shadow"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;
