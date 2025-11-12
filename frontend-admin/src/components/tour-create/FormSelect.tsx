import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";

type Option = {
    label: string;
    value: string;
};

type SelectInputProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    control: Control<T>;
    validationRules?: RegisterOptions<T, Path<T>>;
    options: Option[];
    placeholder?: string;
    className?: string;
    isSmall?: boolean;
};

const FormSelect = <T extends FieldValues>({
    label,
    name,
    control,
    options,
    placeholder = "Chọn...",
    className = "",
    isSmall = false,
    validationRules = {},
}: SelectInputProps<T>) => {
    return (
        <div className={className}>
            <label className={`${isSmall ? "mb-1 text-sm" : "mb-2"} block font-medium`}>
                {label}
                {validationRules?.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <Controller
                name={name}
                control={control}
                rules={validationRules}
                render={({ field, fieldState }) => (
                    <div>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                        >
                            <SelectTrigger
                                className={` border-gray-200 w-full ${
                                    fieldState.error ? "border-red-500" : "border-gray-300"
                                } border rounded  text-base outline-none h-auto`}
                            >
                                <SelectValue placeholder={placeholder} className=""/>
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldState.error && (
                            <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                        )}
                    </div>
                )}
            />
        </div>
    );
};

export default FormSelect;
