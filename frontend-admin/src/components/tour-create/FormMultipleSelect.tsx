import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { X, Check, ChevronDown } from "lucide-react";

type Option = {
    label: string;
    value: string;
};

type MultiSelectInputProps<T extends FieldValues> = {
    label: string;
    name: Path<T>;
    control: Control<T>;
    options: Option[];
    placeholder?: string;
    className?: string;
    validationRules?: RegisterOptions<T, Path<T>>;
};

const FormMutilpeSelect = <T extends FieldValues>({
    label,
    name,
    control,
    options,
    placeholder,
    className = "",
    validationRules = {},
}: MultiSelectInputProps<T>) => {
    return (
        <div className={className}>
            <label className="mb-2 block font-medium">
                {label}
                {validationRules?.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <Controller
                name={name}
                control={control}
                rules={validationRules}
                render={({ field, fieldState }) => {
                    const selectedValues: string[] = field.value || [];

                    return (
                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className={`w-full border rounded-md h-[42px] flex items-center justify-between cursor-pointer ${fieldState.error ? "border-red-500" : "border-gray-300"}`}>
                                        <div
                                            className={`${
                                                selectedValues.length === 0
                                                    ? "p-2"
                                                    : "px-2 "
                                            }  flex flex-wrap gap-2`}
                                        >
                                            {selectedValues.length === 0 && (
                                                <span className="text-gray-500">{placeholder}</span>
                                            )}
                                            {selectedValues.map((val) => (
                                                <span
                                                    key={val}
                                                    className="flex items-center gap-1 bg-gray-100  px-2 py-1 rounded text-[14px]"
                                                >
                                                    {
                                                        options.find((opt) => opt.value === val)
                                                            ?.label
                                                    }
                                                    <X
                                                        size={14}
                                                        className="cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            field.onChange(
                                                                selectedValues.filter(
                                                                    (v) => v !== val
                                                                )
                                                            );
                                                        }}
                                                    />
                                                </span>
                                            ))}
                                        </div>
                                        <ChevronDown className="w-[16px] opacity-50 mr-3.5" />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="start">
                                    <div>
                                        {options.map((opt) => (
                                            <div
                                                key={opt.value}
                                                className="px-2 py-1 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
                                                onClick={() => {
                                                    if (selectedValues.includes(opt.value)) {
                                                        field.onChange(
                                                            selectedValues.filter(
                                                                (v) => v !== opt.value
                                                            )
                                                        );
                                                    } else {
                                                        field.onChange([
                                                            ...selectedValues,
                                                            opt.value,
                                                        ]);
                                                    }
                                                }}
                                            >
                                                {opt.label}
                                                {selectedValues.includes(opt.value) && (
                                                    <Check className="ml-auto w-[14px]" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
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

export default FormMutilpeSelect;
