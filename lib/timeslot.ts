export enum TimeSlotStatus {
  LIVE = 'live',
  NEXT = 'next',
  UPCOMING = 'upcoming',
}

export interface TimeSlot {
  id: number | string;
  title: string;
  date: Date;
  time_from: string;
  time_to: string;
  is_delete: boolean;
  meeting_link: string;
}
