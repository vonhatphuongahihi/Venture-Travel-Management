import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
type Option<T = any> = {
    label: string;
    value: string | number;
    data?: T; // dữ liệu gốc
};

type SearchableSelectProps<T> = {
    placeholder?: string;
    fetchOptions?: (query: string) => Promise<T[]>; // gọi API
    mapOption?: (item: T) => Option<T>; // map từ item API -> Option
    renderOption?: (option: Option<T>) => React.ReactNode; // tuỳ biến hiển thị
    onSelect?: (option: Option<T>) => void;
    error: string | undefined;
};

export function SearchableSelect<T>({
    placeholder = "Nhập để tìm...",
    fetchOptions,
    mapOption,
    renderOption,
    onSelect,
    error,
}: SearchableSelectProps<T>) {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState<Option<T>[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setOptions([]);
            return;
        }

        if (fetchOptions && mapOption) {
            setLoading(true);
            const timeout = setTimeout(() => {
                fetchOptions(query)
                    .then((res) => setOptions(res.map(mapOption)))
                    .finally(() => setLoading(false));
            }, 400); // debounce 400ms
            return () => clearTimeout(timeout);
        }
    }, [query, fetchOptions, mapOption]);

    return (
        <div>
            
            <div className="relative w-full ">
                <div className="flex items-center border border-gray-300 rounded">
                    <button className="px-2">
                        <Search className="text-gray-500 w-[16px]" />
                    </button>
                    <input
                        type="text"
                        className={`flex-1 border-none rounded py-2 pr-2 placeholder:text-gray-500  ${
                            error ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                {loading && <div className="absolute left-2 top-2 text-gray-400">Đang tìm...</div>}

                {options.length > 0 && onSelect && (
                    <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow">
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => onSelect(opt)}
                            >
                                {renderOption ? renderOption(opt) : opt.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
