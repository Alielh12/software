"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { AvailableSlot } from "@/lib/api/doctors";
import { format, parse, addDays, isSameDay, startOfDay } from "date-fns";

interface DateTimePickerProps {
  label?: string;
  selectedDate?: Date;
  selectedTime?: string;
  availableSlots?: AvailableSlot[];
  minDate?: Date;
  maxDate?: Date;
  onDateChange?: (date: Date) => void;
  onTimeChange?: (time: string) => void;
  error?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  label,
  selectedDate,
  selectedTime,
  availableSlots = [],
  minDate = new Date(),
  maxDate = addDays(new Date(), 90),
  onDateChange,
  onTimeChange,
  error,
  disabled,
}: DateTimePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Get time slots for selected date
  const daySlots = selectedDate
    ? availableSlots.filter((slot) =>
        isSameDay(parse(slot.date, "yyyy-MM-dd", new Date()), selectedDate)
      )
    : [];

  // Common time slots (30-minute intervals)
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? 0 : 30;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  });

  // Check if a time slot is available
  const isTimeAvailable = (time: string) => {
    if (!selectedDate || daySlots.length === 0) return true;
    const slot = daySlots.find((s) => s.time === time);
    return slot ? slot.available : false;
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parse(e.target.value, "yyyy-MM-dd", new Date());
    if (!isNaN(date.getTime()) && onDateChange) {
      onDateChange(date);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (isTimeAvailable(time) && onTimeChange) {
      onTimeChange(time);
    }
  };

  // Generate calendar days
  const calendarDays: Date[] = [];
  const startDate = startOfDay(minDate);
  let currentDate = startDate;

  while (currentDate <= maxDate) {
    calendarDays.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return (
    <div className="w-full space-y-4">
      {/* Date Picker */}
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="flex space-x-2">
          <Input
            type="date"
            value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
            onChange={handleDateInputChange}
            min={format(minDate, "yyyy-MM-dd")}
            max={format(maxDate, "yyyy-MM-dd")}
            error={error}
            disabled={disabled}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={disabled}
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Time Slot Picker */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Select Time
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
            {timeSlots.map((time) => {
              const available = isTimeAvailable(time);
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSelect(time)}
                  disabled={!available || disabled}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg border transition-colors",
                    isSelected
                      ? "bg-primary-600 text-white border-primary-600"
                      : available
                      ? "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      : "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  )}
                >
                  {time}
                </button>
              );
            })}
          </div>
          {selectedTime && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selected: {selectedTime}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

