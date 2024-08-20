import { LocalDate } from "edgedb";

export default function toLocalDate(date: string){
    const datePart = date.split("T");
    const [year, month, day] = datePart[0].split("-").map(Number);
    const localDate = new LocalDate(year, month, day);
    return localDate;
}