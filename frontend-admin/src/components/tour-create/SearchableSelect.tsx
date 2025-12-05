import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
type Option<T = any> = {
    label: string;
    value: string | number;
    data?: T;
};

type SearchableSelectProps<T> = {
    placeholder?: string;
    fetchOptions?: (query: string) => Promise<T[]>;
    mapOption?: (item: T) => Option<T>;
    renderOption?: (option: Option<T>) => React.ReactNode;
    onSelect?: (option: Option<T>) => void;
    error?: string;
    // ✅ Thêm props để sync với form
    value?: string; // giá trị từ form
    defaultLabel?: string; // label ban đầu (nếu có)
    onChange?: (value: string | number) => void; // callback khi thay đổi
};

export function SearchableSelect<T>({
    placeholder = "Nhập để tìm...",
    fetchOptions,
    mapOption,
    renderOption,
    onSelect,
    error,
    value, // ✅ Nhận value từ form
    defaultLabel, // ✅ Nhận label ban đầu
    onChange, // ✅ Callback để update form
}: SearchableSelectProps<T>) {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<Option<T>[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option<T> | null>(null);

    useEffect(() => {
        if (value) {
            // Có value và label từ form
            setSelectedOption({
                value: value,
                label: defaultLabel,
            } as Option<T>);
            setQuery(value);
        } else if (!value) {
            // Form value bị clear
            setSelectedOption(null);
            setQuery("");
        }
    }, [value, defaultLabel]);

    // Debounce search
    useEffect(() => {
        if (selectedOption) return;

        if (!query) {
            setOptions([]);
            setLoading(false);
            return;
        }

        if (fetchOptions && mapOption) {
            setLoading(true);
            const timeout = setTimeout(() => {
                fetchOptions(query)
                    .then((res) => setOptions(res.map(mapOption)))
                    .finally(() => setLoading(false));
            }, 600);
            return () => clearTimeout(timeout);
        }
    }, [query, fetchOptions, mapOption, selectedOption]);

    const handleSelect = (option: Option<T>) => {
        setSelectedOption(option);
        setQuery(option.label);
        setOptions([]);
        
        // ✅ Gọi onChange để update form
        if (onChange) {
            onChange(option.value);
        }
        
        if (onSelect) {
            onSelect(option);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setQuery(inputValue);
        
        if (selectedOption) {
            setSelectedOption(null);
            // ✅ Clear value trong form
            if (onChange) {
                onChange("");
            }
        }
    };

    const handleClear = () => {
        setSelectedOption(null);
        setQuery("");
        
        // ✅ Clear value trong form
        if (onChange) {
            onChange("");
        }
    };

    

    return (
        <div>
            <div className="relative w-full">
                <div className={`flex items-center border rounded ${
                    error ? "border-red-500" : "border-gray-300"
                }`}>
                    <button type="button" className="px-2">
                        <Search className="text-gray-500 w-[16px]" />
                    </button>
                    <input
                        type="text"
                        className="flex-1 border-none rounded py-2 pr-2 placeholder:text-gray-500 outline-none"
                        placeholder={placeholder}
                        value={query}
                        onChange={handleInputChange}
                    />
                    {selectedOption && (
                        <button
                            type="button"
                            className="px-2"
                            onClick={handleClear}
                        >
                            <X className="text-gray-500 w-[16px]" />
                        </button>
                    )}
                </div>
                
                {loading && (
                    <div className="absolute z-10 w-full bg-white border mt-1 rounded shadow">
                        <div className="text-gray-400 px-3 py-2">Đang tìm...</div>
                    </div>
                )}

                {options.length > 0 && !selectedOption && (
                    <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-auto">
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(opt)}
                            >
                                {renderOption ? renderOption(opt) : opt.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}