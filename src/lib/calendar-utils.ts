export const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function eventFallsOnDay(
  isoString: string,
  year: number,
  month: number,
  day: number,
): boolean {
  const d = new Date(isoString);
  return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
}
