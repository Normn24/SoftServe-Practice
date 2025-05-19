import React, { useMemo, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/locale";

import { Session } from "../../types/authTypes";

registerLocale("en", enGB);

const formatDisplayDate = (dateString: string): string => {
  try {
    const date = new Date(dateString + "T00:00:00Z");
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  } catch (e) {
    console.error("Invalid date format for display:", dateString, e);
    return dateString;
  }
};

const getDatePart = (dateTime: string | Date): string => {
  if (dateTime instanceof Date) {
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return dateTime.split("T")[0];
};

interface DateTabsProps {
  allSessions: Session[];
  currentSelectedDate: string | null;
  onDateSelect: (date: string) => void;
}

const DateTabs: React.FC<DateTabsProps> = ({
  allSessions,
  currentSelectedDate,
  onDateSelect,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { availableDatesForTabs, uniqueAvailableDatesObjects } = useMemo(() => {
    if (!allSessions || allSessions.length === 0) {
      return { availableDatesForTabs: [], uniqueAvailableDatesObjects: [] };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateSet = new Set<string>();
    allSessions.forEach((session) => {
      try {
        const sessionDateTime = session.dateTime;
        const sessionDate = new Date(sessionDateTime);
        sessionDate.setHours(0, 0, 0, 0);

        if (sessionDate >= today) {
          dateSet.add(getDatePart(sessionDateTime));
        }
      } catch (e) {
        console.error(
          "Invalid session dateTime in DateTabs:",
          session.dateTime,
          e
        );
      }
    });

    const sortedDatesArray = Array.from(dateSet).sort();

    return {
      availableDatesForTabs: sortedDatesArray.map((dateValue) => ({
        value: dateValue,
        label: formatDisplayDate(dateValue),
      })),
      uniqueAvailableDatesObjects: sortedDatesArray.map(
        (dateStr) => new Date(dateStr + "T00:00:00Z")
      ),
    };
  }, [allSessions]);

  const handleCalendarChange = (date: Date | null) => {
    if (date) {
      onDateSelect(getDatePart(date));
    }
    setIsCalendarOpen(false);
  };

  const MAX_TABS_DISPLAYED = 5;
  const tabsToShow = availableDatesForTabs.slice(0, MAX_TABS_DISPLAYED);

  if (availableDatesForTabs.length === 0) {
    return <div className="mb-6 text-gray-400">No sessions available.</div>;
  }

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto items-center">
      {tabsToShow.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onDateSelect(value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 ease-in-out
                        ${
                          currentSelectedDate === value
                            ? "bg-red-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                        }`}
        >
          {label}
        </button>
      ))}
      <div>
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 flex items-center"
          aria-label="Choose a day from the calendar"
        >
          {availableDatesForTabs.length > MAX_TABS_DISPLAYED ||
          tabsToShow.length === 0
            ? "Choose a day"
            : "Other dates"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          {availableDatesForTabs.length > MAX_TABS_DISPLAYED && (
            <span className="ml-2 bg-yellow-500 text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
              +{availableDatesForTabs.length - MAX_TABS_DISPLAYED}
            </span>
          )}
        </button>
        {isCalendarOpen && (
          <div className="absolute z-20 mt-1 ">
            <DatePicker
              selected={
                currentSelectedDate
                  ? new Date(currentSelectedDate + "T00:00:00Z")
                  : null
              }
              onChange={handleCalendarChange}
              includeDates={uniqueAvailableDatesObjects}
              inline
              locale="en"
              dateFormat="dd.MM.yyyy"
              minDate={new Date()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTabs;
