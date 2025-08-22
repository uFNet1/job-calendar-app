function getCurrentDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  return { year: yyyy, month: mm, day: dd };
}
export default function Calendar() {
  const date = getCurrentDate();
  return (
    <>
      <div>
        <button type="button">{date.year}</button>
      </div>
    </>
  );
}
