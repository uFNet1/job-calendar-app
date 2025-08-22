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
function calculateDays(month: number, year: number) {
  const days = [];
  let weeks = [];
  let countDays = 0;
  const firstWeekDay = getFirstWeekDay(month, year);
  const totalDays = daysInMonth(month, year);
  if (firstWeekDay - 1 !== 0) {
    for (let index = 0; index < firstWeekDay - 1; index++) {
      weeks.push(<td>&nbsp;</td>);
      countDays++;
    }
  }
  console.log(totalDays);
  for (let index = 0; index < totalDays; index++) {
    if (countDays === 7) {
      days.push(weeks);
      weeks = [];
      countDays = 0;
    }
    weeks.push(<td>{index + 1}</td>);
    countDays++;
    if (index === totalDays - 1) {
      days.push(weeks);
    }
  }
  console.log(days);
  return days;
}
export default function Calendar() {
  const date = getCurrentDate();
  const days = calculateDays(Number(date.month), date.year);
  return (
    <>
      <div>
        <button type="button">{date.year}</button>
      </div>
      <table>
        <thead>
          <tr>
            <th scope="col">Пн</th>
            <th scope="col">Вт</th>
            <th scope="col">Ср</th>
            <th scope="col">Чт</th>
            <th scope="col">Пт</th>
            <th scope="col">Сб</th>
            <th scope="col">Нд</th>
          </tr>
        </thead>
        <tbody>
          {days?.map((el, index) => (index % 7 === 0 ? <tr></tr> : el))}
        </tbody>
      </table>
    </>
  );
}
