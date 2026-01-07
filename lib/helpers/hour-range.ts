export function hourRange(startDate: Date, endDate: Date) {
  const final = (date: Date) =>
    date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  return `${final(startDate)} - ${final(endDate)}`;
} 