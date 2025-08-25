import { useState } from "react";
import Cookies from "js-cookie";

export default function Settings({
  isSelectingDay,
  onSelectDay,
  onSetDays,
  isDaySelected,
  isFormFilled,
  onSetShowType,
}) {
  const [workDays, setWorkDays] = useState<number | null>(null);
  const [restDays, setRestDays] = useState<number | null>(null);
  const [isWarning, setIsWarning] = useState(false);

  function getScheduleCookie(type: number) {
    const cookie = Cookies.get("schedule");
    if (cookie) {
      const cookieArr = cookie.split(",");
      if (cookieArr[type]) {
        if (type === 1) {
          console.log("ase");
          setWorkDays(Number(cookieArr[type]));
          setRestDays(Number(cookieArr[type]));
        }
        return Number(cookieArr[type]);
      }
    }
    return undefined;
  }

  const submitDays = () => {
    console.log(workDays);
    if (workDays && restDays) {
      onSetDays([workDays, restDays]);
      setIsWarning(false);
    } else {
      setIsWarning(true);
      alert("Помилка: Не всі поля графіку введені!");
    }
  };
  const setShowType = (value) => {
    onSetShowType(value);
  };
  const inputStyle = (dataType: string | null) => {
    return `w-8 h-8 bg-white rounded-lg text-black pl-2 text-center ${
      isWarning && dataType === null ? `outline-3 outline-red-500` : null
    }`;
  };
  const tickStyle = (dataType: boolean | null) => {
    return `${!dataType ? `before:content-['❌']` : `before:content-['✔']`} before:mr-3`;
  };
  return (
    <>
      <fieldset className="border border-gray-600 flex flex-col items-start">
        <legend className="mr-auto ml-4 px-3">Налаштування:</legend>
        <div className="flex flex-row gap-4 my-2 items-center ml-5">
          {/* <input type="checkbox" name="" id="" /> */}
          <p className={tickStyle(isFormFilled)}>Графік:</p>
          <input
            onInput={(e) => {
              (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.slice(0, 1);
              setWorkDays((e.target as HTMLInputElement).value);
            }}
            type="number"
            name="workDayFirst"
            id="workDayFirst"
            className={inputStyle(workDays)}
            value={getScheduleCookie(0)}
          />
          <p>x</p>
          <input
            onInput={(e) => {
              e.target.value = e.target.value.slice(0, 1);
              setRestDays(e.target.value);
            }}
            maxLength={1}
            type="number"
            name="workDaySecond"
            id="workDaySecond"
            className={inputStyle(restDays)}
            value={getScheduleCookie(1)}
          />
          <button onClick={submitDays} type="button" className="w-8 h-8">
            ✔
          </button>
        </div>
        <span className={`${tickStyle(isDaySelected)} ml-5`}>
          <button type="button" className={`px-4 py-2 my-4`} onClick={onSelectDay}>
            Обрати перший роб. день
          </button>
        </span>
        <hr className="border border-gray-300 w-2/3 mx-auto my-3" />
        <div className="ml-5 mb-2">
          <input
            className="mr-3 w-4 h-4"
            type="radio"
            name="showOnly"
            id="showAll"
            value="all"
            onClick={() => setShowType(0)}
            defaultChecked={true}
          />
          <label htmlFor="showAll">Всі</label>
        </div>
        <div className="ml-5 mb-2">
          <input
            className="mr-3 w-4 h-4 accent-green-700"
            type="radio"
            name="showOnly"
            id="showOnlyWork"
            value="onlyWork"
            onClick={() => setShowType(1)}
          />
          <label htmlFor="showOnlyWork">Тільки робочі</label>
        </div>
        <div className="ml-5 mb-3">
          <input
            className="mr-3 w-4 h-4 accent-red-700"
            type="radio"
            name="showOnly"
            id="showOnlyRest"
            value="onlyRest"
            onClick={() => setShowType(2)}
          />
          <label htmlFor="showOnlyRest">Тільки вихідні</label>
        </div>
      </fieldset>
    </>
  );
}
