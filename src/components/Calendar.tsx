import { useState } from "react";
import Settings from "./Settings";

function getCurrentDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return { year: yyyy, month: mm, day: dd };
}
function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}
function getFirstWeekDay(month: number, year: number) {
  return new Date(year, month - 1, 1).getDay();
}
export default function Calendar() {
  const [isSelectingDay, setIsSelectingDay] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [workDays, setWorkDays] = useState(null);
  const [restDays, setRestDays] = useState(null);
  function calculateDays(month: number, year: number) {
    const days = [];
    let weeks = [];
    let countDays = 0;
    const firstWeekDay = getFirstWeekDay(month, year);
    const totalDays = daysInMonth(month, year);
    if (firstWeekDay - 1 !== 0) {
      for (let index = 0; index < firstWeekDay - 1; index++) {
        weeks.push(<td key={year + month + index}>&nbsp;</td>);
        countDays++;
      }
    }
    for (let index = 0; index < totalDays; index++) {
      if (countDays === 7) {
        days.push(weeks);
        weeks = [];
        countDays = 0;
      }
      const thisNumber = index + 1;
      weeks.push(
        <td
          key={month + index}
          onClick={(el) => {
            if (isSelectingDay) {
              setSelectedDay(el.target.textContent);
              setIsSelectingDay(false);
            }
          }}
          className={`cursor-pointer calendar-button px-2 py-1 rounded-lg ${
            isSelectingDay
              ? `animate-pulse bg-gray-600 hover:scale-105 hover:outline hover:outline-amber-200`
              : ``
          } ${Number(selectedDay) === thisNumber ? `bg-gray-600` : ``}`}
        >
          {thisNumber}
        </td>
      );
      countDays++;
      if (index === totalDays - 1) {
        days.push(weeks);
      }
    }
    return days;
  }
  const date = getCurrentDate();
  const days = calculateDays(Number(date.month), date.year);
  return (
    <>
      <Settings
        isSelectingDay={isSelectingDay}
        onSelectDay={() => setIsSelectingDay((prev) => !prev)}
      />
      <div>
        <button type="button" className="px-4 py-2 mt-4">
          {date.year}
        </button>
      </div>
      <table className="border-separate border-spacing-3 mx-auto">
        <thead>
          <tr></tr>
        </thead>
        <tbody>
          <tr className="font-bold">
            <td>Пн</td>
            <td>Вт</td>
            <td>Ср</td>
            <td>Чт</td>
            <td>Пт</td>
            <td className="text-amber-200">Сб</td>
            <td className="text-amber-200">Нд</td>
          </tr>
          {days?.map((el, index) => (
            <tr key={index}>{el.map((data) => data)}</tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
