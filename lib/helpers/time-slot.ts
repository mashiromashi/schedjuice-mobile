import { TimeSlot, TimeSlotStatus } from '../timeslot';

const normalizeSlotDate = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const buildDateWithTime = (date: Date, time: string) => {
  const [hours = 0, minutes = 0, seconds = 0] = (time ?? '')
    .split(':')
    .map((part) => Number.parseInt(part, 10) || 0);

  const result = new Date(date);
  result.setHours(hours, minutes, seconds, 0);
  return result;
};

export const getSlotStatus = (slot: TimeSlot, now = new Date()) => {
  const slotDate = normalizeSlotDate(slot.date);
  if (!slotDate) {
    return TimeSlotStatus.UPCOMING;
  }

  const start = buildDateWithTime(slotDate, slot.time_from);
  const rawEnd = buildDateWithTime(slotDate, slot.time_to);
  const end = rawEnd > start ? rawEnd : new Date(start.getTime() + 15 * 60 * 1000);

  if (now >= start && now < end) {
    return TimeSlotStatus.LIVE;
  }

  const ONE_HOUR = 60 * 60 * 1000;

  if (now < start && start.getTime() - now.getTime() <= ONE_HOUR) {
    return TimeSlotStatus.NEXT;
  }

  return TimeSlotStatus.UPCOMING;
};
