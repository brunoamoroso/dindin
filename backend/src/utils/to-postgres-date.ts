export function toPostgresDate(date: string): string{
    return date.split("T")[0];
}