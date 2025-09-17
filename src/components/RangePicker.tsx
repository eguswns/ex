import type { Moment } from "moment";
import moment from "moment";
import { useMemo, useState, useEffect } from "react";
import "./RangePicker.scss";
import Month from "./Month";

interface Range {
  start: Moment | null;
  end: Moment | null;
}

interface RangePickerProps {
  onChange?: (depart: Moment, arrive: Moment | null) => void;
}

export default function RangePicker({ onChange }: RangePickerProps) {
  const [visibleMonth, setVisibleMonth] = useState(moment().startOf("month"));
  const [range, setRange] = useState<Range>({ start: null, end: null });
  const [select, setSelect] = useState<"start" | "end">("start");
  const months = useMemo(
    () => [visibleMonth, moment(visibleMonth).add(1, "month")],
    [visibleMonth]
  );
  const weekdays = useMemo(
    () => ["일", "월", "화", "수", "목", "금", "토"],
    []
  );

  useEffect(() => {
    if (onChange && range.start && range.end) {
      onChange(range.start, range.end);
    }
  }, [range]);

  function handleDateClick(date: Moment) {
    if (select === "start") {
      if (range.end && date.isSameOrBefore(range.end, "day")) {
        setRange({ start: date, end: range.end });
        setSelect("start");
      } else {
        setRange({ start: date, end: date });
        setSelect("end");
      }
    } else {
      if (range.start && date.isBefore(range.start, "day")) {
        setRange({ start: date, end: null });
        setSelect("end");
      } else {
        setRange({ start: range.start, end: date });
        setSelect("start");
      }
    }
  }

  function handleTimeChange(target: "start" | "end", timeString: string) {
    const [hour, minute] = timeString.split(":").map(Number);
    setRange((prev) => {
      if (!prev) return prev;
      const dateToChange = target === "start" ? prev.start : prev.end;
      if (!dateToChange) return prev;
      const updated = dateToChange.clone().hour(hour).minute(minute).second(0);
      return target === "start"
        ? { start: updated, end: prev.end }
        : { start: prev.start, end: updated };
    });
  }

  function nextMonth() {
    setVisibleMonth((prev) => moment(prev).add(2, "month"));
  }

  function prevMonth() {
    setVisibleMonth((prev) => moment(prev).subtract(2, "month"));
  }

  return (
    <div className="range-picker-container">
      <div className="months-wrapper">
        {months.map((month, idx) => (
          <Month
            month={month}
            idx={idx}
            range={range}
            onDateClick={handleDateClick}
            onTimeChange={handleTimeChange}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            weekdays={weekdays}
          />
        ))}
      </div>
    </div>
  );
}
