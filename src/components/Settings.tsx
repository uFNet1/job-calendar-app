export default function Settings({ isSelectingDay, onSelectDay }) {
  const inputStyle = `w-8 h-8 bg-white rounded-lg text-black`;
  return (
    <>
      {isSelectingDay ? console.log("test") : console.log("ber")}
      <fieldset className="border border-gray-600">
        <legend className="mr-auto ml-4 px-3">Налаштування:</legend>
        <div className="flex flex-row gap-4 my-2 items-center mx-4">
          {/* <input type="checkbox" name="" id="" /> */}
          <p className="">Графік:</p>
          <input
            onInput={(e) => (e.target.value = e.target.value.slice(0, 1))}
            type="number"
            name="workDayFirst"
            id="workDayFirst"
            className={inputStyle}
          />
          <p>x</p>
          <input
            onInput={(e) => (e.target.value = e.target.value.slice(0, 1))}
            maxLength={1}
            type="number"
            name="workDaySecond"
            id="workDaySecond"
            className={inputStyle}
          />
          <button type="button" className="w-8 h-8">
            ✔
          </button>
        </div>
        <button
          type="button"
          className={`px-4 py-2 my-4 `}
          onClick={onSelectDay}
        >
          Обрати перший робочий день
        </button>
      </fieldset>
    </>
  );
}
