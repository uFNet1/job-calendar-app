import { useEffect, useState, useRef, type JSX, useCallback, Fragment } from "react";
import Settings from "./Settings";
import Cookies from "js-cookie";
import CalendarTable from "./CalendarTable";
import CalendarDate from "./CalendarDate";

type CalendarRender = {
  date: { year: number; month: number; day: number };
  days: JSX.Element[][];
};
type dateFormat = {
  year: number;
  month: number;
  day: number;
};

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
  const dd = Number(today.getDate());
  const mm = Number(today.getMonth() + 1);
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
  const [currentObserver, setCurrentObserver] = useState<IntersectionObserver | null>(null);
  const [calendars, setCalendars] = useState<CalendarRender[]>([]);
  const calendarRef = useRef<HTMLTableElement | null>(null);
  const [dateData, setDateData] = useState<dateFormat>(getCurrentDate());
  // const [remainingToSelect, setRemainingToSelect] = useState(0);
  // const [typeToSelect, setTypeToSelect] = useState(0);

  useEffect(() => {
    const selectedDayCookie = Cookies.get("firstWorkDay");
    if (selectedDayCookie) {
      const date = selectedDayCookie.split(",");
      setSelectedDay(date[2]);
    }
  }, []);

  const handleScroll = () => {
    // if (document.documentElement.scrollHeight - 300)
    // initializeCalendar();
    updateCalendar();
  };

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
  const calculateDays = useCallback(
    (date: dateFormat) => {
      const days = [];
      let weeks = [];
      let countDays = 0;
      let typeToSelect = 0;
      const firstWeekDay = getFirstWeekDay(date.month, date.year);
      const totalDays = daysInMonth(date.month, date.year);

      //start listing blank days
      if (firstWeekDay - 1 !== 0) {
        for (let index = 0; index < firstWeekDay - 1; index++) {
          weeks.push(<td key={date.year + date.month + index}>&nbsp;</td>);
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
        const totalBothDays = workDays + restDays;
        const isAllowedToCalculate = isFormFilled ? (selectedDay !== null ? true : false) : false;
        if (selectedDay) {
          //current day type = ((This day) - (Day selected by user)) Mod (Sum of workDays + restDays)
          currentDayType = mod(thisDay - Number(selectedDay), totalBothDays);
          if (currentDayType >= 0 && currentDayType < workDays) {
            typeToSelect = 0; //work day
          } else if (currentDayType >= workDays && currentDayType < totalBothDays) {
            typeToSelect = 1;
          }
        }
        const isToday = thisDay === Number(date.day);
        weeks.push(appendDaysToArr(date.month + index, thisDay, isToday, typeToSelect, isAllowedToCalculate));

        countDays++;
        if (index === totalDays - 1) {
          days.push(weeks);
        }
      }
      return days;
    },
    [appendDaysToArr]
  );
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
            // Cookies.set("firstWorkDay", `${date.year},${date.month},${el.target.textContent}`);
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

  const updateCalendar = useCallback(
    (today: boolean = false) => {
      setDateData((prevDate) => {
        let newDate: typeof prevDate;

        if (!today) {
          if (prevDate.month === 12) {
            newDate = { ...prevDate, year: prevDate.year + 1, month: 1, day: 0 };
          } else {
            newDate = { ...prevDate, month: prevDate.month + 1, day: 0 };
          }
        } else {
          newDate = getCurrentDate();
        }

        // ✅ Update calendars in the same pass
        setCalendars((prevData) => {
          // Avoid duplicate entries
          const exists = prevData.some(
            (c) => c.date.year === newDate.year && c.date.month === newDate.month && c.date.day === newDate.day
          );
          if (exists) return prevData;

          return [...prevData, { date: newDate, days: calculateDays(newDate) }];
        });

        return newDate;
      });
    },
    [calculateDays] // ✅ deps are correct now
  );

  useEffect(() => {
    updateCalendar(true);

    const observer = new IntersectionObserver(
      (e) => {
        e.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("test");
            handleScroll();
          }
        });
      },
      { rootMargin: "10px" }
    );
    setCurrentObserver(observer);
  }, []);
  useEffect(() => {
    if (calendarRef.current && currentObserver) {
      console.log(calendarRef);
      currentObserver.disconnect();
      currentObserver.observe(calendarRef.current);
      console.log("hello");
    }
    return () => currentObserver?.disconnect();
  }, [calendars]);

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

      {calendars.map((el, i) => {
        return (
          <Fragment key={i}>
            <CalendarDate key={`${i}_${i}`} date={el.date} months={months} />
            <CalendarTable key={i} days={el.days} ref={calendarRef} />
          </Fragment>
        );
      })}

      {/* next Month */}
      {/* <CalendarDate date={date} months={months} />
      <CalendarTable days={days} /> */}
    </div>
  );
}
