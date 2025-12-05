import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Checkbox({ label, error, className, id, ...props }: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      <div className="flex items-start">
        <input
          id={checkboxId}
          type="checkbox"
          className={cn(
            "mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded",
            "dark:bg-gray-800 dark:border-gray-600",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              "ml-2 text-sm text-gray-700 dark:text-gray-300",
              error && "text-red-600 dark:text-red-400"
            )}
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

