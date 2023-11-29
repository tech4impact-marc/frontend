export function convertDateToString(date: string): string {
  const dateValue = new Date(date)
  return `${dateValue.getFullYear()}년 ${dateValue.getMonth() + 1}월 ${dateValue.getDate()}일`
}
