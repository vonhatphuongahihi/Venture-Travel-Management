import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";

import ReactQuillNew from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type TextEditorProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    control: Control<T>;
    placeholder?: string;
    className?: string;
    validationRules?: RegisterOptions<T, Path<T>>;
};

const TextEditor = <T extends FieldValues>({
    label,
    name,
    control,
    placeholder,
    className = "",
    validationRules = {},
}: TextEditorProps<T>) => {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link"],
            ["clean"],
        ],
    };

    return (
        <div className={className}>
            <label className={`block font-medium mb-2`}>
                {label} {validationRules.required && <span className="text-red-500">*</span>}
            </label>
            <Controller
                name={name}
                control={control}
                rules={validationRules}
                render={({ field, fieldState }) => {
                    return (
                        <div>
                            <ReactQuillNew
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                theme="snow"
                                modules={modules}
                                placeholder={placeholder}
                                className={`my-quill-new ${
                                    fieldState.error ? "my-quill-new-error" : ""
                                }`}
                            />
                            {fieldState.error && (
                                <p className="text-red-500 text-sm mt-1">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default TextEditor;
