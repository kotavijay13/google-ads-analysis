
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  onDateChange: (range: { from: Date; to: Date }) => void;
}

type DatePreset = {
  name: string;
  label: string;
  getValue: () => { from: Date; to: Date };
};

const DateRangePicker = ({ onDateChange }: DateRangePickerProps) => {
  const today = new Date();
  
  const datePresets: DatePreset[] = [
    {
      name: 'today',
      label: 'Today',
      getValue: () => ({
        from: today,
        to: today
      })
    },
    {
      name: 'yesterday',
      label: 'Yesterday',
      getValue: () => {
        const yesterday = subDays(today, 1);
        return {
          from: yesterday,
          to: yesterday
        };
      }
    },
    {
      name: 'this-week',
      label: 'This week (Mon – Today)',
      getValue: () => ({
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: today
      })
    },
    {
      name: 'last-7-days',
      label: 'Last 7 days',
      getValue: () => ({
        from: subDays(today, 6),
        to: today
      })
    },
    {
      name: 'last-week',
      label: 'Last week (Mon – Sun)',
      getValue: () => {
        const lastWeekStart = subDays(startOfWeek(today, { weekStartsOn: 1 }), 7);
        const lastWeekEnd = subDays(endOfWeek(today, { weekStartsOn: 1 }), 7);
        return {
          from: lastWeekStart,
          to: lastWeekEnd
        };
      }
    },
    {
      name: 'last-14-days',
      label: 'Last 14 days',
      getValue: () => ({
        from: subDays(today, 13),
        to: today
      })
    },
    {
      name: 'this-month',
      label: 'This month',
      getValue: () => ({
        from: startOfMonth(today),
        to: today
      })
    },
    {
      name: 'last-30-days',
      label: 'Last 30 days',
      getValue: () => ({
        from: subDays(today, 29),
        to: today
      })
    },
    {
      name: 'last-month',
      label: 'Last month',
      getValue: () => {
        const lastMonth = subDays(startOfMonth(today), 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth)
        };
      }
    },
    {
      name: 'all-time',
      label: 'All time',
      getValue: () => ({
        from: new Date(2020, 0, 1), // Arbitrary start date
        to: today
      })
    }
  ];

  const [date, setDate] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(today, 30), // Default to last 30 days
    to: today,
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(true);
  const [customDays, setCustomDays] = useState('30');

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

  const handlePresetSelect = (preset: DatePreset) => {
    const newRange = preset.getValue();
    setDate(newRange);
    onDateChange(newRange);
    setIsOpen(false);
  };

  const handleCustomDaysChange = (days: string, type: 'today' | 'yesterday') => {
    setCustomDays(days);
    
    if (days && !isNaN(Number(days))) {
      const numDays = Number(days);
      const endDate = type === 'today' ? today : subDays(today, 1);
      const startDate = subDays(endDate, numDays - 1);
      
      const newRange = {
        from: startDate,
        to: endDate
      };
      
      setDate(newRange);
      onDateChange(newRange);
    }
  };

  return (
    <div className="grid gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="w-[280px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd MMM yyyy")} - {format(date.to, "dd MMM yyyy")}
                </>
              ) : (
                format(date.from, "dd MMM yyyy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {showPresets && (
              <div className="border-r min-w-[200px]">
                <div className="p-2 border-b">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start font-normal text-left"
                    onClick={() => setShowPresets(false)}
                  >
                    Custom
                  </Button>
                </div>
                
                <div className="py-2">
                  {datePresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="ghost"
                      className="w-full justify-start font-normal text-left"
                      onClick={() => handlePresetSelect(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
                
                <div className="p-3 border-t space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <input 
                        type="number"
                        className="w-16 border rounded p-1 text-sm"
                        value={customDays}
                        onChange={(e) => setCustomDays(e.target.value)}
                        min="1"
                      />
                      <span className="text-sm">days up to today</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleCustomDaysChange(customDays, 'today')}
                    >
                      Apply
                    </Button>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <input 
                        type="number"
                        className="w-16 border rounded p-1 text-sm"
                        value={customDays}
                        onChange={(e) => setCustomDays(e.target.value)}
                        min="1"
                      />
                      <span className="text-sm">days up to yesterday</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleCustomDaysChange(customDays, 'yesterday')}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              {!showPresets && (
                <div className="p-2 border-b">
                  <Button 
                    variant="ghost"
                    onClick={() => setShowPresets(true)}
                  >
                    ← Back to presets
                  </Button>
                </div>
              )}
              
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
                numberOfMonths={2}
                className="p-3 pointer-events-auto"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
