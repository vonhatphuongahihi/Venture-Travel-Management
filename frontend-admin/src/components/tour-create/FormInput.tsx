import { get } from "react-hook-form";
import type {
    FieldErrors,
    FieldValues,
    Path,
    RegisterOptions,
    UseFormRegister,
    
} from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
    label: string;
    type?: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    placeholder?: string;
    validationRules?: RegisterOptions<T, Path<T>>;
    className?: string;
    isSmall?: boolean;
    defaultValue?: string | number;
};

const FormInput = <T extends FieldValues>({
    label,
    type = "text",
    name,
    register,
    errors,
    placeholder,
    validationRules = {},
    className = "",
    isSmall = false,
    defaultValue,
}: FormInputProps<T>) => {
    const error = get(errors, name);
    return (
        <div className={className}>
            <label className={`block ${isSmall ? "mb-1 text-sm" : "mb-2"} font-medium`}>
                {label} {validationRules?.required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                defaultValue={defaultValue}
                {...register(name, validationRules)}
                className={`w-full border placeholder:text-gray-500 ${isSmall ? "p-1" : "p-2"} rounded ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{String(error.message)}</p>
            )}
        </div>
    );
};

export default FormInput;