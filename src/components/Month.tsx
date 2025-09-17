import type { Moment } from "moment";
import { useMemo } from "react";
import "./Month.scss";

interface MonthProps {
  month: Moment;
  idx: number;
  range: { start: Moment | null; end: Moment | null };
  onDateClick: (date: Moment) => void;
  onTimeChange: (target: "start" | "end", time: string) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  weekdays: string[];
}

export default function Month({
  month,
  idx,
  range,
  onDateClick,
  onTimeChange,
  prevMonth,
  nextMonth,
  weekdays,
}: MonthProps) {
  const startDay = month.startOf("month").day();
  const daysInMonth = month.daysInMonth();
  const dates = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => month.clone().date(i + 1)),
    [month, daysInMonth]
  );
  const blanks = useMemo(() => Array.from({ length: startDay }), [startDay]);
  const timeType = idx === 0 ? "start" : "end";
  const selectedMoment = range[timeType];
  const timeValue = selectedMoment ? selectedMoment.format("HH:mm") : "00:00";

  return (
    <div className="month-container">
      <div className="month-header-container">
        {idx === 0 && (
          <button onClick={prevMonth} className="arrow-button left-arrow">
            &lt;
          </button>
        )}
        <div className="month-header">{month.format("YYYY.MM")}</div>
        {idx === 1 && (
          <button onClick={nextMonth} className="arrow-button right-arrow">
            &gt;
          </button>
        )}
      </div>
      <div className="days-grid">
        {weekdays.map((wd) => (
          <div key={wd} className="weekday-header">
            {wd}
          </div>
        ))}
        {blanks.map((_, i) => (
          <span key={`blanks-${i}`} className="blank"></span>
        ))}
        {dates.map((date) => {
          const isStart = range.start && date.isSame(range.start, "day");
          const isEnd = range.end && date.isSame(range.end, "day");
          const isInRange =
            range.start &&
            range.end &&
            date.isAfter(range.start, "day") &&
            date.isBefore(range.end, "day");
          return (
            <button
              onClick={() => onDateClick(date)}
              className={`date${isStart ? " start-date" : ""}${
                isEnd ? " end-date" : ""
              }${isInRange ? " in-range" : ""}`}
            >
              {date.date()}
            </button>
          );
        })}
      </div>
      <div className="month-time-selector">
        <label>{timeType === "start" ? "시작 시간" : "종료 시간"}</label>
        <input
          type="time"
          value={timeValue}
          onChange={(e) => onTimeChange(timeType, e.target.value)}
        />
      </div>
    </div>
  );
}
