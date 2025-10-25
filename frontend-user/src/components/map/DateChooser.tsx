"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { vi } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface DateChooserProps {
  startDate?: Date;
  selectedDate: Date; // ngày hiện tại
  onDateChange: (date: Date) => void; // callback trả về ngày mới
  onClose?: () => void; // callback khi đóng dialog
  className?: string; // className tuỳ chỉnh
}

export function DateChooser({
  startDate,
  selectedDate,
  onDateChange,
  onClose,
  className,
}: DateChooserProps) {
  const [tempDate, setTempDate] = React.useState<Date | undefined>(
    selectedDate
  );

  const handleApply = () => {
    if (tempDate) {
      onDateChange(tempDate);
    }
    onClose();
  };
  
  return (
    <div className={`py-2 w-[300px] flex-col z-50 bg-white outline outline-1 outline-primary rounded-lg ${className}`}>
      <DayPicker
        mode="single"
        selected={tempDate}
        onSelect={(date) => {
          if (date) {
            setTempDate(date); // chỉ update khi có date
          }
          // nếu date === undefined (người dùng click bỏ chọn), thì giữ nguyên
        }}
        locale={vi}
        classNames={{
          day_selected:
            "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day: "h-9 w-9 p-0 text-[#202224]/50 rounded font-['Inter'] hover:text-primary-foreground",
          day_today: "font-bold",
          nav_button_previous:
            "w-6 h-6 bg-primary rounded text-white hover:bg-[#0891B2] hover:text-primary-foreground",
          nav_button_next:
            "w-6 h-6 bg-primary rounded text-white hover:bg-[#0891B2]",
          nav: "space-x-2",
          month: "font-['Inter'] font-bold",
        }}
        disabled={
          startDate
            ? { before: startDate } // nếu có startDate thì disable hết ngày < startDate
            : undefined
        }
      />
      <div className="w-full flex justify-end px-3">
        <Button onClick={handleApply}>Áp dụng</Button>
      </div>
    </div>
  );
}
