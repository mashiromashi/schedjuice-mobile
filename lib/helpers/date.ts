import {
  format,
  parse,
  differenceInMilliseconds,
  getDaysInMonth as getDaysInMonthFn,
} from 'date-fns';
import { isSabbath } from 'mm-cal-js';
import { differenceInDays } from 'date-fns';
import { Time } from '@internationalized/date';

export const formatDate = (dateString: string | Date, formatString = 'MMM do yyyy') => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, formatString);
  } catch (error) {
    console.error(error);
    // Return original string if parsing fails
    return String(dateString);
  }
};

export const formatDateMonthYear = (dateString: string | Date, formatString = 'dd/MM/yy') => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, formatString);
  } catch (error) {
    console.error(error);
    return String(dateString);
  }
};

export const formatTime = (timeString: string) => {
  // Handle cases where timeString might already be a full datetime
  const date = timeString.includes('T')
    ? new Date(timeString)
    : new Date(`2000-01-01T${timeString}`);
  return format(date, 'HH:mm');
};

export const formatDateTime = (dateString: string | Date) => {
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMMM do yyyy HH:mm');
  } catch (error) {
    // Return original string if parsing fails
    return String(dateString);
  }
};

export const countDaysFromToday = (dateInput: string | Date): string => {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const today = new Date();

    // Normalize both to midnight
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffDays = differenceInDays(normalizedDate, normalizedToday);
    const abs = Math.abs(diffDays);

    // Convert to readable short form
    if (abs >= 365) {
      const years = Math.floor(abs / 365);
      return `${years}y`;
    } else if (abs >= 30) {
      const months = Math.floor(abs / 30);
      return `${months}m`;
    } else {
      return `${abs}d`;
    }
  } catch (error) {
    console.error('Invalid date in countDaysFromToday:', dateInput, error);
    return '0d';
  }
};

export const formatEventTime = (timeString: string) => {
  try {
    const date = parse(timeString, 'HH:mm:ss', new Date());
    return format(date, 'hh:mm a');
  } catch (error) {
    // Fallback for different time formats
    const date = new Date(`2000-01-01T${timeString}`);
    return format(date, 'hh:mm a');
  }
};

export const getDaysInMonth = (month: number, year: number) => {
  let date = new Date(year, month, 1);
  let days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const getDateISOString = (date: Date) => {
  date = new Date(date);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export const cleanDatesForBackend = (obj: any, dateKeys: string[]) => {
  Object.keys(obj).map((k) => {
    if (dateKeys.includes(k) && obj[k]) {
      obj[k] = getDateISOString(obj[k]);
    }
  });
  return obj;
};
export const sortEvents = (eventATimeFrom: string, eventBTimeFrom: string) => {
  return Number(eventATimeFrom.replaceAll(':', '')) - Number(eventBTimeFrom.replaceAll(':', ''));
};

export const dateToTimeValue = (date: string | Date) => {
  if (typeof date === 'string' || date instanceof String) {
    date = new Date(date);
  }
  return stringToTimeValue(date.toTimeString());
};

export const stringToTimeValue = (timeString: string) => {
  return new Time(Number(timeString.split(':')[0]), Number(timeString.split(':')[1]));
};

export const secondsToHHmmss = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
};

export const calculateDifference = (date1: Date, date2: Date) => {
  const milliseconds = differenceInMilliseconds(date2, date1);
  const seconds = Math.abs(Math.ceil((milliseconds / 1000) % 60));
  const minutes = Math.abs(Math.ceil((milliseconds / 1000 / 60) % 60));
  const hours = Math.abs(Math.ceil((milliseconds / 1000 / 60 / 60) % 24));
  const days = Math.ceil(Math.abs(milliseconds / 1000 / 60 / 60 / 24));
  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds: Math.abs(milliseconds % 1000),
  };
};

export const getSundaysAndSabbathDaysOfMonth = (year: number, month: number) => {
  const sundaysAndSabbathDays: number[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    if (date.getDay() === 0 || isSabbath(date) === 1) {
      sundaysAndSabbathDays.push(i);
    }
  }
  return sundaysAndSabbathDays;
};

export interface GetDaysLeftResult {
  message: string;
}

// /helper/date.ts (or any util file)
export function getDaysLeft(due: string | Date | undefined): number | null {
  if (!due) return null;
  const dueDate = new Date(due);
  const today = new Date();

  // strip time (so diff is in whole days)
  const d0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const d1 = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((d1.getTime() - d0.getTime()) / msPerDay);
}
