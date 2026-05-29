"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("px-3 text-sm", className)}
            classNames={{
                today: "rdp-today",
                selected: "rdp-selected",
                ...classNames,
            }}
            {...props}
        />
    );
}

export { Calendar };
