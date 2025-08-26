export default function CalendarDate({ date, months }) {
  return (
    <div>
      <button type="button" className="px-4 py-2 mt-4">
        {date.year}
      </button>
      <p>
        {date.month} - {months[Number(date.month)]}
      </p>
    </div>
  );
}
