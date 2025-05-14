
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  onDateChange: (range: { from: Date; to: Date }) => void;
}

const DateRangePicker = ({ onDateChange }: DateRangePickerProps) => {
  const [date, setDate] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(2023, 4, 1),
    to: new Date(2023, 4, 14),
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const newDate = {
      from: date.from,
      to: date.to,
    };

    if (!date.from || date.to) {
      newDate.from = selectedDate;
      newDate.to = selectedDate;
    } else if (selectedDate < date.from) {
      newDate.from = selectedDate;
    } else {
      newDate.to = selectedDate;
    }

    setDate(newDate);
    if (newDate.from && newDate.to) {
      onDateChange(newDate);
    }
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="w-[260px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={{
              from: date.from,
              to: date.to,
            }}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                if ('from' in selectedDate && 'to' in selectedDate) {
                  setDate({
                    from: selectedDate.from || date.from,
                    to: selectedDate.to || date.to
                  });
                  if (selectedDate.from && selectedDate.to) {
                    onDateChange({
                      from: selectedDate.from,
                      to: selectedDate.to
                    });
                  }
                }
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
