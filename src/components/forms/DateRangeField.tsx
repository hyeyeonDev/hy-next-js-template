"use client";

import { InputHTMLAttributes, useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface DateRangeValue {
  start?: string;
  end?: string;
}

export interface DateRangeFieldProps {
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  startProps?: InputHTMLAttributes<HTMLInputElement>;
  endProps?: InputHTMLAttributes<HTMLInputElement>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(value?: string) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getMonthDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const days: Array<Date | null> = [];

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(month.getFullYear(), month.getMonth(), day));
  }

  return days;
}

function formatDisplay(value?: string) {
  return value?.replaceAll("-", ".");
}

function isInRange(dateKey: string, range: DateRangeValue) {
  if (!range.start || !range.end) return false;
  return dateKey > range.start && dateKey < range.end;
}

function isSameDay(left?: string, right?: string) {
  return !!left && left === right;
}

function MonthCalendar({
  month,
  range,
  onSelect,
}: {
  month: Date;
  range: DateRangeValue;
  onSelect: (dateKey: string) => void;
}) {
  const days = getMonthDays(month);

  return (
    <div className="min-w-0">
      <p className="mb-3 text-center text-sm font-semibold text-text">
        {month.getFullYear()}년 {month.getMonth() + 1}월
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-text-subtle">
        {DAYS.map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <span key={`empty-${index}`} className="h-8" />;
          }

          const dateKey = toDateKey(date);
          const selectedStart = isSameDay(dateKey, range.start);
          const selectedEnd = isSameDay(dateKey, range.end);
          const ranged = isInRange(dateKey, range);

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelect(dateKey)}
              className={cn(
                "flex h-8 items-center justify-center rounded-md text-sm transition-colors",
                "hover:bg-primary-50 hover:text-primary-700",
                ranged && "bg-primary-50 text-primary-700",
                (selectedStart || selectedEnd) &&
                  "bg-primary-600 font-semibold text-white hover:bg-primary-600 hover:text-white",
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangeField({
  value,
  defaultValue,
  onChange,
  startProps,
  endProps,
  placeholder = "기간 선택",
  className,
  disabled,
}: DateRangeFieldProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<DateRangeValue>(defaultValue ?? {});
  const range = value ?? internalValue;
  const initialMonth = parseDateKey(range.start) ?? new Date();
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1),
  );

  const displayValue = useMemo(() => {
    if (range.start && range.end) {
      return `${formatDisplay(range.start)} - ${formatDisplay(range.end)}`;
    }
    if (range.start) {
      return `${formatDisplay(range.start)} - 종료일`;
    }
    return "";
  }, [range]);

  const update = (next: DateRangeValue) => {
    if (value === undefined) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const selectDate = (dateKey: string) => {
    if (!range.start || range.end || dateKey < range.start) {
      update({ start: dateKey, end: undefined });
      return;
    }

    update({ start: range.start, end: dateKey });
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-border bg-surface px-3 text-left text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary-500",
          disabled && "cursor-not-allowed bg-surface-2 text-text-subtle",
        )}
      >
        <span className={cn(displayValue ? "text-text" : "text-text-subtle")}>
          {displayValue || placeholder}
        </span>
        <Calendar className="h-4 w-4 shrink-0 text-text-subtle" aria-hidden="true" />
      </button>

      <input type="hidden" name={startProps?.name} value={range.start ?? ""} />
      <input type="hidden" name={endProps?.name} value={range.end ?? ""} />

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[320px] rounded-lg border border-border bg-surface p-3 shadow-xl sm:w-[560px]">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
              className="rounded-md p-1 text-text-muted hover:bg-surface-2 hover:text-text"
              aria-label="이전 달"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="text-xs text-text-muted">
              시작일과 종료일을 차례로 선택하세요
            </p>
            <button
              type="button"
              onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
              className="rounded-md p-1 text-text-muted hover:bg-surface-2 hover:text-text"
              aria-label="다음 달"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MonthCalendar month={visibleMonth} range={range} onSelect={selectDate} />
            <MonthCalendar month={addMonths(visibleMonth, 1)} range={range} onSelect={selectDate} />
          </div>
        </div>
      )}
    </div>
  );
}

export const DateRange = DateRangeField;
