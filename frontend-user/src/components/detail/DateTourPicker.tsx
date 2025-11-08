import { DateChooser } from "@/components/map/DateChooser";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";
import React, { useState } from "react";

function DateTourPicker({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const [open, setOpen] = useState(false);
  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    // Format theo ngôn ngữ tiếng Việt
    let formatted = date.toLocaleDateString("vi-VN", options);
    // Mặc định `toLocaleDateString` ở vi-VN sẽ ra "thứ ba, 27 tháng 9, 2025"
    formatted = formatted.replace(/, (\d+)/, (match, p1) => `, ngày ${p1}`);
    // Viết hoa chữ cái đầu
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="flex items-center justify-center w-68 h-12 bg-white hover:bg-gray-300 text-primary relative rounded-3xl outline outline-1 outline-offset-[-1px] outline-primary">
          <Calendar size={24} />
          <p>{formatDate(selectedDate)}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <DateChooser
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onClose={() => {
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DateTourPicker;
