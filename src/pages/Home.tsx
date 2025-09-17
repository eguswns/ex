import { useCallback, useState } from "react";
import RangePicker from "../components/RangePicker";
import type { Moment } from "moment";
import "./Home.scss";

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [tripInfo, setTripInfo] = useState({
    departDateTime: "",
    arriveDateTime: "",
  });

  const handleRangeChange = useCallback(
    (depart: Moment, arrive: Moment | null) => {
      const arriveDate = arrive ?? depart;
      setTripInfo({
        departDateTime: depart.format("YYYY-MM-DD HH:mm"),
        arriveDateTime: arriveDate.format("YYYY-MM-DD HH:mm"),
      });
    },
    []
  );

  return (
    <div>
      <h1>여행 예약</h1>
      <div className="header">
        <button className="calendar-btn" onClick={() => setShowCalendar(true)}>
          예약 날짜 선택
        </button>

        <div className="trip-info">
          <h3>출발: {tripInfo.departDateTime || "선택하세요"}</h3>
          <h3>도착: {tripInfo.arriveDateTime || "선택하세요"}</h3>
        </div>
      </div>

      {showCalendar && (
        <div className="calendar">
          <RangePicker onChange={handleRangeChange} />
          <button className="close-btn" onClick={() => setShowCalendar(false)}>
            닫기
          </button>
        </div>
      )}
    </div>
  );
}
