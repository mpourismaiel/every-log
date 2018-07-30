const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const formatDate = (date: Date, format: string) => {
  return format
    .replace(/%dd/g, daysOfWeek[date.getDay()])
    .replace(/%d/g, date.getDate().toString())
    .replace(
      /%0d/g,
      date.getDate().toString().length === 1
        ? '0' + date.getDate()
        : date.getDate().toString(),
    )
    .replace(/%m/g, (date.getMonth() + 1).toString())
    .replace(
      /%mm/g,
      date.getMonth().toString().length === 1
        ? '0' + date.getMonth()
        : date.getMonth().toString(),
    )
    .replace(/%y/g, date.getFullYear().toString())
    .replace(/%H/g, date.getHours().toString())
    .replace(/%M/g, date.getMinutes().toString())
    .replace(/%S/g, date.getSeconds().toString());
};
