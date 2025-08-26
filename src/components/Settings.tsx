import { useState, useEffect } from "react";
import Cookies from "js-cookie";

// Define a type for the component's props for better type safety.
type SettingsProps = {
  isDaySelected: boolean;
  isFormFilled: boolean;
  onSelectDay: () => void;
  onSetDays: (days: [number, number]) => void;
  onSetShowType: (type: number) => void;
};

export default function Settings({
  onSelectDay,
  onSetDays,
  isDaySelected,
  isFormFilled,
  onSetShowType,
}: SettingsProps) {
  // Initialize state with null to clearly distinguish between '0' and 'not set'.
  const [workDays, setWorkDays] = useState<number | null>(null);
  const [restDays, setRestDays] = useState<number | null>(null);
  const [isWarning, setIsWarning] = useState(false);

  // useEffect runs once on component mount to initialize state from cookies.
  useEffect(() => {
    const scheduleCookie = Cookies.get("schedule");
    if (scheduleCookie) {
      const [work, rest] = scheduleCookie.split(",");

      // Safely parse cookie values and update state.
      const parsedWork = parseInt(work, 10);
      const parsedRest = parseInt(rest, 10);

      if (!isNaN(parsedWork) && !isNaN(parsedRest)) {
        setWorkDays(parsedWork);
        setRestDays(parsedRest);

        onSetDays([parsedWork, parsedRest]);
      }
    }
  }, []); // Empty dependency array ensures this runs only once.

  const handleDaysSubmit = () => {
    // Improved validation: Check for null instead of truthiness to allow '0'.
    if (workDays !== null && restDays !== null && workDays >= 1 && restDays >= 1) {
      onSetDays([workDays, restDays]);
      setIsWarning(false);
    } else {
      // Set warning state to show an inline error message instead of an alert.
      setIsWarning(true);
    }
  };

  // Generic handler for numeric inputs to keep code DRY.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    const value = e.target.value;
    // Allow only a single digit.
    if (/^\d*$/.test(value) && value.length <= 1) {
      setter(value === "" ? null : parseInt(value, 10));
    }
  };

  const inputStyle = (value: number | null) => {
    // Simplified style logic. Outline is now applied if a field is empty during a warning.
    return `w-8 h-8 bg-white rounded-lg text-black text-center ${
      isWarning && value === null ? "outline outline-2 outline-red-500" : ""
    }`;
  };

  const tickStyle = (isComplete: boolean) => {
    return `${isComplete ? "before:content-['✔']" : "before:content-['❌']"} before:mr-3`;
  };

  return (
    <>
      <fieldset className="border border-gray-600 flex flex-col items-start">
        <legend className="mr-auto ml-4 px-3">Налаштування:</legend>
        <div className="flex flex-col items-start ml-5">
          <div className="flex flex-row gap-4 my-2 items-center">
            <p className={tickStyle(isFormFilled)}>Графік:</p>
            <input
              onChange={(e) => handleInputChange(e, setWorkDays)}
              type="number"
              maxLength={1}
              className={inputStyle(workDays)}
              // Value is now controlled by the component's state.
              value={workDays ?? ""}
            />
            <p>x</p>
            <input
              onChange={(e) => handleInputChange(e, setRestDays)}
              type="number"
              maxLength={1}
              className={inputStyle(restDays)}
              // Value is now controlled by the component's state.
              value={restDays ?? ""}
            />
            <button onClick={handleDaysSubmit} type="button" className="w-8 h-8">
              ✔
            </button>
          </div>
          {/* Improved user feedback: Inline error message instead of alert() */}
          {isWarning && <p className="text-red-500 text-sm mb-2">Помилка: Не всі поля графіку введені!</p>}
        </div>
        <span className={`${tickStyle(isDaySelected)} ml-5`}>
          <button type="button" className="px-4 py-2 my-4" onClick={onSelectDay}>
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
            onClick={() => onSetShowType(0)}
            defaultChecked
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
            onClick={() => onSetShowType(1)}
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
            onClick={() => onSetShowType(2)}
          />
          <label htmlFor="showOnlyRest">Тільки вихідні</label>
        </div>
      </fieldset>
    </>
  );
}
