const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const formatDate = (date: Date, format: string): string => {
  const firstDayOfTheMonth = new Date(date);
  firstDayOfTheMonth.setDate(1);
  const weekNumber =
    Math.floor((firstDayOfTheMonth.getDay() + date.getDate() - 1) / 7) + 1;

  return format
    .replace(/%dd/g, daysOfWeek[date.getDay()])
    .replace(/%d/g, date.getDate().toString())
    .replace(
      /%0d/g,
      date.getDate().toString().length === 1
        ? '0' + date.getDate()
        : date.getDate().toString(),
    )
    .replace(/%w/g, weekNumber.toString())
    .replace(/%mmm/g, months[date.getMonth()])
    .replace(
      /%mm/g,
      date.getMonth().toString().length === 1
        ? '0' + (date.getMonth() + 1)
        : (date.getMonth() + 1).toString(),
    )
    .replace(/%m/g, (date.getMonth() + 1).toString())
    .replace(/%y/g, date.getFullYear().toString())
    .replace(
      /%HH/g,
      date.getHours().toString().length === 1
        ? '0' + date.getHours()
        : date.getHours().toString(),
    )
    .replace(/%H/g, date.getHours().toString())
    .replace(
      /%MM/g,
      date.getMinutes().toString().length === 1
        ? '0' + date.getMinutes()
        : date.getMinutes().toString(),
    )
    .replace(/%M/g, date.getMinutes().toString())
    .replace(
      /%SS/g,
      date.getSeconds().toString().length === 1
        ? '0' + date.getSeconds()
        : date.getSeconds().toString(),
    )
    .replace(/%S/g, date.getSeconds().toString());
};

export const relativeDate = (date: Date, format: string): string => {
  const dateUnix = date.valueOf();
  const todayUnix = new Date().setHours(0, 0, 0).valueOf();
  const day = 1000 * 60 * 60 * 24;
  if (dateUnix > todayUnix) {
    return 'Today';
  } else if (dateUnix > todayUnix - day) {
    return 'Yesterday';
  } else if (dateUnix > todayUnix - day * 6) {
    return formatDate(date, '%dd');
  } else {
    return formatDate(date, format);
  }
};

export const isSameDay = (date1: Date | number, date2: Date | number) => {
  const startOfDay = new Date(date1);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date1);
  endOfDay.setHours(24, 59, 59, 99);
  const date = new Date(date2).valueOf();
  return startOfDay.valueOf() < date && date < endOfDay.valueOf();
};
