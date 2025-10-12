import React, { useState, useEffect, useRef } from "react";

import { FaCheck } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
interface Option {
    value: string;
    label: string;
}

interface SelectItemProps {
    optionList: Option[];
    selected: string;
    setSelected: (selected: string) => void;
    IconComponent?: React.ReactNode;
}

const SelectItem = ({ optionList, selected, setSelected, IconComponent }: SelectItemProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleSelect = (optionValue: string) => {
        setSelected(optionValue);
        setOpen(false);
    };

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex gap-1 items-baseline">
            <div className="relative w-[150px] flex-1 cursor-pointer" ref={wrapperRef}>
                <div
                    className="px-2 py-[6px] rounded-lg h-full bg-gray-100 flex text-[14px] items-center text-gray-500"
                    onClick={() => setOpen(!open)}
                >
                    {IconComponent && <div className="p-1">{IconComponent}</div>}
                    <span>{optionList.find((option) => option.value === selected)?.label}</span>
                    <MdKeyboardArrowDown className="ml-auto" />
                </div>
                {open && (
                    <ul className="bg-white p-1 shadow rounded-lg mt-2 absolute top-9 right-0 z-10 w-full flex flex-col gap-1">
                        {optionList.map((option) => (
                            <li
                                key={option.value}
                                className={`py-1 px-2 hover:bg-primary/10 rounded-md text-[14px] flex items-center justify-between `}
                                onClick={() => handleSelect(option.value)}
                            >
                                <span>{option.label}</span>
                                {selected == option.value && (
                                    <FaCheck className="text-primary w-3 h-3"></FaCheck>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SelectItem;
