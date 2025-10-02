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
  DialogDescription
} from "@/components/ui/dialog";

interface DateChooserProps {
  startDate?: Date;
  selectedDate: Date; // ngày hiện tại
  onDateChange: (date: Date) => void; // callback trả về ngày mới
}

export function DateChooser({ startDate, selectedDate, onDateChange }: DateChooserProps) {
  const [open, setOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date | undefined>(
    selectedDate
  );

  const handleApply = () => {
    if (tempDate) {
      onDateChange(tempDate);
    }
    setOpen(false);
  };
  const formatDate = (date: Date): string => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button
              className={`flex bg-white justify-between w-full px-2 py-1 outline outline-1 outline-[#26B8ED] text-black rounded font-['Inter'] hover:bg-white`}
            >
              <p className="font-['Inter']">{formatDate(selectedDate)}</p>
              <div className="p-1 bg-primary rounded hover:bg-[#0891B2]">
                <CalendarDays className="text-white w-6 h-6" />
              </div>
            </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
      <DialogHeader>
        <DialogTitle className="sr-only">Chọn một ngày</DialogTitle>
        <DialogDescription className="sr-only">Không có mô tả</DialogDescription>
      </DialogHeader>
        <div>
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
              day_selected: "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day: "h-9 w-9 p-0 text-[#202224]/50 rounded font-['Inter'] hover:text-primary-foreground",
              day_today: "font-bold",
              nav_button_previous: "w-6 h-6 bg-primary rounded text-white hover:bg-[#0891B2] hover:text-primary-foreground",
              nav_button_next: "w-6 h-6 bg-primary rounded text-white hover:bg-[#0891B2]",
              nav: "space-x-2",
              month: "font-['Inter'] font-bold",
            }}
            disabled={
              startDate
                ? { before: startDate } // nếu có startDate thì disable hết ngày < startDate
                : undefined
            }
          />
        </div>
        <DialogFooter>
          <Button onClick={handleApply}>Áp dụng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
