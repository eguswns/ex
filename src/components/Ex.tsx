import type { Moment } from "moment";
import moment from "moment";
import { useState } from "react";
import "./Ex.scss";

interface Range {
  start: Moment | null;
  end: Moment | null;
}

export default function Ex() {
  // 현재 화면에 표시할 기준인 월을 저장
  const [visibleMonth, setVisibleMonth] = useState(moment().startOf("month"));
  // 처음엔 아무 것도 선택하지 않으니 둘 다 null
  const [range, setRange] = useState<Range>({ start: null, end: null });
  // start date or end date 선택하고 있는지
  const [select, setSelect] = useState<"start" | "end">("start");
  // 렌더링 할 두 개의 월
  const months = [visibleMonth, moment(visibleMonth).add(1, "month")];

  function handleDateClick(date: Moment) {
    // 시작일 선택
    if (select === "start") {
      // 종료일이 존재하고, 클릭한 날짜가 종료일 이전 또는 같은 경우
      if (range.end && date.isSameOrBefore(range.end, "day")) {
        setRange({ start: date, end: range.end }); // 시작일만 클릭한 날짜로 변경
        setSelect("start"); // 다시 시작일 선택 유지
      } else {
        // 클릭 날짜가 종료일 이후이거나 종료일이 없으면
        setRange({ start: date, end: date }); // 시작일과 종료일 클릭한 날짜
        setSelect("end"); // 종료일 선택으로 변경
      }
    } else {
      // 종료일 선택
      // 시작일이 존재하고, 클릭한 날짜가 시작일 이전인 경우
      if (range.start && date.isBefore(range.start, "day")) {
        setRange({ start: date, end: null }); // 시작일을 클릭한 날짜로 바꾸고 종료일은 초기화
        setSelect("end"); // 종료일 선택 유지
      } else {
        // 클릭 날짜가 시작일 이후인 경우
        setRange({ start: range.start, end: date }); // 종료일을 클릭한 날짜로 변경
        setSelect("start"); // 시작일 선택 모드로 변경
      }
    }
  }

  function handleTimeChange(target: "start" | "end", timeString: string) {
    // 시간 문자열은 : 기준으로 나눠서 숫자 배열로 변환
    const [hour, minute] = timeString.split(":").map(Number);

    setRange((prev) => {
      if (!prev) return prev; // 이전 상태 없으면 그대로 유지

      // 업데이트 날짜 (start인지 end인지 선택)
      const dateToChange = target === "start" ? prev.start : prev.end;
      if (!dateToChange) return prev; // 대상 날짜 없으면 상태 변경 안함
      // 대상 날짜를 복제해 시간 정보만 새로 지정
      const updated = dateToChange.clone().hour(hour).minute(minute).second(0);
      // 타겟에 따라 시작 또는 종료 날짜만 새로 업데이트
      return target === "start"
        ? { start: updated, end: prev.end }
        : { start: prev.start, end: updated };
    });
  }
  // 2개월 앞으로 이동시키는 함수
  function nextMonth() {
    setVisibleMonth((prev) => moment(prev).add(2, "month"));
  }

  // 2개월 뒤로 이동시키는 함수
  function prevMonth() {
    setVisibleMonth((prev) => moment(prev).subtract(2, "month"));
  }

  function renderMonth(month: Moment, idx: number) {
    // 현재 렌더링할 월의 첫 날이 있는 요일 인덱스
    const startDay = month.startOf("month").day();
    // 해당 월에 포함된 총 일수
    const daysInMonth = month.daysInMonth();
    // 달력에 표시할 날짜 리스트
    const dates: Moment[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      // moment(month)로 월 정보를 복사하고 날짜만 i일로 설정
      dates.push(moment(month).date(i));
    }
    // 달력 첫 주 빈칸 처리용 리스트
    const blanks = [];
    for (let i = 0; i < startDay; i++) {
      blanks.push(<span className="blank"></span>);
    }

    // idx 0은 시작일 시간, idx 1은 종료일 시간
    const timeType = idx === 0 ? "start" : "end";
    // 현재 선택 범위 상태에서 시작일/종료일 중 해당 idx에 맞는 moment 객체 추출
    const selectedMoment = range[timeType];
    // 선택된 날짜가 있으면 "HH:mm", 없으면 "00:00"
    const timeValue = selectedMoment ? selectedMoment.format("HH:mm") : "00:00";

    return (
      <div className="month-container">
        {/* 왼쪽/오른쪽 화살표 및 월 텍스트  */}
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

        {/* 달력 날짜 그리드 */}
        <div className="days-grid">
          {/* 요일 리스트 */}
          {["일", "월", "화", "수", "목", "금", "토"].map((wd) => (
            <div className="weekday-header">{wd}</div>
          ))}

          {/* 빈칸 표시 */}
          {blanks}

          {/* 실제 날짜 버튼 */}
          {dates.map((date) => {
            // 현재 날짜가 선택된 시작, 종료일과 같은지
            const isStart = range.start && date.isSame(range.start, "day");
            const isEnd = range.end && date.isSame(range.end, "day");

            // 현재 날짜가 시작일과 종료일 사이에 포함되는지 여부
            const isInRange =
              range.start &&
              range.end &&
              date.isAfter(range.start, "day") &&
              date.isBefore(range.end, "day");

            return (
              <button
                key={date.format("YYYY-MM-DD")}
                onClick={() => handleDateClick(date)}
                className={`date ${isStart ? "start-date" : ""} ${
                  isEnd ? "end-date" : ""
                } ${isInRange ? "in-range" : ""}`}
              >
                {date.date()}
              </button>
            );
          })}
        </div>

        {/* 시간 선택 */}
        <div className="month-time-selector">
          <label>{timeType === "start" ? "시작 시간" : "종료 시간"}</label>
          <input
            type="time"
            value={timeValue}
            onChange={(e) => handleTimeChange(timeType, e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="range-picker-container">
      <div className="months-wrapper">
        {months.map((month, idx) => renderMonth(month, idx))}
      </div>
    </div>
  );
}
