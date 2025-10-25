export function formatLocalDate(date: string): string{
  const dateTimePart = date.split("T")[0];
  const [year, month, day] = dateTimePart.split("-").map(Number);
  const newLocalDate = new Date(year, month - 1, day);
  return newLocalDate.toLocaleDateString();
}
