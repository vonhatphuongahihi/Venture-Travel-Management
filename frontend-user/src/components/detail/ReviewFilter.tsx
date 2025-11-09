"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

function ReviewFilter({
  value,
  setValue,
  options,
}: {
  value: string;
  setValue: (value: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <p>{value}</p>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((opt, index) => (
                <CommandItem
                  key={index}
                  value={opt}
                  className={`${opt !== value?"cursor-pointer":"cursor-default"}`}
                  onSelect={(currentValue) => {
                    if (currentValue !== value) {
                      setValue(currentValue);
                      setOpen(false);
                    }
                  }}
                >
                  {opt}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === opt ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ReviewFilter;
