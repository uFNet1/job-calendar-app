import { useEffect, useState } from "react";
import Settings from "./Settings";
import Cookies from "js-cookie";
import CalendarTable from "./CalendarTable";
import CalendarDate from "./CalendarDate";

const months = [
  "",
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

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
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
export default function Calendar() {
  const [isSelectingDay, setIsSelectingDay] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [formData, setFormData] = useState(["", ""]);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [showOnly, setShowOnly] = useState(0);
  // const [remainingToSelect, setRemainingToSelect] = useState(0);
  // const [typeToSelect, setTypeToSelect] = useState(0);

  useEffect(() => {
    const selectedDayCookie = Cookies.get("firstWorkDay");
    if (selectedDayCookie) {
      const date = selectedDayCookie.split(",");
      setSelectedDay(date[2]);
    }
  }, []);

  const handleChange = (value) => {
    console.log("asd");
    const newData = formData.map((c, index) => {
      return value[index];
    });
    setFormData(newData);
    if (newData[0] !== "" && newData[1] !== "") {
      setIsFormFilled((prev) => true);
      Cookies.set("schedule", value);
    }
  };
  const handleRadioButtons = (value) => {
    setShowOnly(value);
  };
  function calculateDays(month: number, year: number) {
    const days = [];
    let weeks = [];
    let countDays = 0;
    let typeToSelect = 0;
    const firstWeekDay = getFirstWeekDay(month, year);
    const totalDays = daysInMonth(month, year);

    //start listing blank days
    if (firstWeekDay - 1 !== 0) {
      for (let index = 0; index < firstWeekDay - 1; index++) {
        weeks.push(<td key={year + month + index}>&nbsp;</td>);
        countDays++;
      }
    }
    //start listing actual days
    for (let index = 0; index < totalDays; index++) {
      //reset days on 7
      if (countDays === 7) {
        days.push(weeks);
        weeks = [];
        countDays = 0;
      }
      const thisDay = index + 1;
      let currentDayType = null;

      //calculate which days are work and which are rest
      const workDays = Number(formData[0]);
      const restDays = Number(formData[1]);
      const totaBothDays = workDays + restDays;
      const isAllowedToCalculate = isFormFilled ? (selectedDay !== null ? true : false) : false;
      if (selectedDay) {
        //current day type = ((This day) - (Day selected by user)) Mod (Sum of workDays + restDays)
        currentDayType = mod(thisDay - Number(selectedDay), totaBothDays);
        if (currentDayType >= 0 && currentDayType < workDays) {
          typeToSelect = 0; //work day
        } else if (currentDayType >= workDays && currentDayType < totaBothDays) {
          typeToSelect = 1;
        }
      }
      const isToday = thisDay === Number(date.day);
      weeks.push(appendDaysToArr(month + index, thisDay, isToday, typeToSelect, isAllowedToCalculate));

      countDays++;
      if (index === totalDays - 1) {
        days.push(weeks);
      }
    }
    return days;
  }
  function appendDaysToArr(
    key: number,
    thisDay: number,
    isToday: boolean,
    typeToSelect: number,
    isAllowedToCalculate: boolean
  ) {
    console.log(showOnly);
    return (
      <td
        key={key}
        onClick={(el) => {
          if (isSelectingDay) {
            setSelectedDay(el.target.textContent);
            setIsSelectingDay(false);
            Cookies.set("firstWorkDay", `${date.year},${date.month},${el.target.textContent}`);
          }
        }}
        className={`cursor-pointer calendar-button px-2 py-1 rounded-lg 
        
        ${isSelectingDay ? `animate-pulse bg-gray-600 hover:scale-105 hover:outline hover:outline-amber-200` : ``}
        ${Number(selectedDay) === thisDay ? `bg-gray-600` : ``}
        
        ${isToday && `text-white font-bold outline outline-emerald-200`}
        ${
          isAllowedToCalculate !== false
            ? typeToSelect === 0
              ? showOnly === 0 || showOnly === 1
                ? `bg-red-700`
                : null
              : showOnly === 0 || showOnly === 2
              ? `bg-green-700`
              : null
            : null
        }
        `}
      >
        {thisDay}
      </td>
    );
  }
  const date = getCurrentDate();
  const days = calculateDays(Number(date.month), date.year);
  return (
    <div className="h-svh">
      <Settings
        onSetDays={handleChange}
        isSelectingDay={isSelectingDay}
        onSelectDay={() => setIsSelectingDay((prev) => !prev)}
        isDaySelected={selectedDay}
        isFormFilled={isFormFilled}
        onSetShowType={handleRadioButtons}
      />
      <CalendarDate date={date} months={months} />
      <CalendarTable days={days} />
      {/* next Month */}
      <CalendarDate date={date} months={months} />
      <CalendarTable days={days} />
    </div>
  );
}
