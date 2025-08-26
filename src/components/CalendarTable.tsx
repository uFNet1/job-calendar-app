export default function CalendarTable({ days }) {
  return (
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
  );
}
