import type {
    FieldErrors,
    FieldValues,
    Path,
    RegisterOptions,
    UseFormRegister,
    
} from "react-hook-form";
import { get } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    placeholder?: string;
    validationRules?: RegisterOptions<T, Path<T>>;
    className?: string;
    row?: number,
    isSmall?: boolean;
};

const FormTextArea = <T extends FieldValues>({
    label,
    name,
    register,
    errors,
    placeholder,
    validationRules = {},
    className = "",
    row = 3,
    isSmall = false,
} : FormInputProps<T>) => {
    const error = get(errors, name);

    return (
        <div className={`flex-1 ${className}`}>
            <label
                className={`block font-medium mb-2 ${
                    isSmall ? "" : "text-base"
                }`}
            >
                {label}{" "}
                {validationRules.required && (
                    <span className="text-red-500">*</span>
                )}
            </label>
            <textarea
                rows={row}
                placeholder={placeholder}
                {...register(name, validationRules)}
                className={`w-full border p-2 rounded resize-none placeholder:text-gray-500 ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
            ></textarea>
            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {String(error?.message)}
                </p>
            )}
        </div>
    );
};

export default FormTextArea;
