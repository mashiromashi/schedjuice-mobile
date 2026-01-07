// ./assignmentslot-status.tsx
import { cn } from '@/lib/utils';
import { assignmentStatus } from '@/types/assignment';
import { Text, View } from 'react-native';

export const assignmentCard = {
  daysLeftBg: '#FFE4E6',
  daysLeftText: '#C62828',

  resubmitBg: '#FFE4E6',
  resubmitText: '#C62828',

  pendingBg: '#FEF9C3',
  pendingText: '#92400E',

  submittedBg: '#E7F5EC',
  submittedText: '#2E7D32',

  gradedBg: '#E3F2FD',
  gradedText: '#1565C0',

  failedBg: '#FFE4E6',
  failedText: '#C62828',
};

export function AssignmentStatusPill({
  status,
  dueDate,
  daysLeft,
}: {
  status: assignmentStatus;
  dueDate?: string | Date;
  daysLeft?: number;
}) {
  // label logic
  let label = '';
  switch (status) {
    case assignmentStatus.locked:
      label = 'Locked';
      break;
    case assignmentStatus.overdue:
      label = 'Overdue';
      break;
    case assignmentStatus.require_resubmission:
      label = 'Resubmittion Required';
      break;
    case assignmentStatus.available_to_submit:
      label = 'Available to Submit';
      break;
    case assignmentStatus.ready_to_be_graded:
      label = 'Ready to be Graded';
      break;
    case assignmentStatus.submitted:
      label = 'Submitted';
      break;
    case assignmentStatus.graded:
      label = 'Graded';
      break;

    default:
      label = '—';
  }

  return (
    <View
      className={cn('', {
        'border-blue-600 bg-blue-50 text-blue-600':
          status === assignmentStatus.available_to_submit ||
          status === assignmentStatus.ready_to_be_graded,
        'border-red-600 bg-red-50 text-red-600':
          status === assignmentStatus.overdue || status === assignmentStatus.require_resubmission,
        'border-slate-300 bg-slate-300 text-black':
          status === assignmentStatus.locked || status === assignmentStatus.submitted,
        'border-green-600 bg-green-50 text-green-600': status === assignmentStatus.graded,
      })}
      style={{
        borderWidth: 1,
        borderRadius: 9999,
        paddingHorizontal: 8,
        paddingVertical: 3,
      }}>
      <Text
        className={cn('', {
          'bg-blue-50 text-blue-600':
            status === assignmentStatus.available_to_submit ||
            status === assignmentStatus.ready_to_be_graded,
          'bg-red-50 text-red-600':
            status === assignmentStatus.overdue || status === assignmentStatus.require_resubmission,
          'bg-slate-300 text-black':
            status === assignmentStatus.locked || status === assignmentStatus.submitted,
          'bg-green-50 text-green-600': status === assignmentStatus.graded,
        })}
        style={{
          fontSize: 12,
        }}>
        {label}
      </Text>
    </View>
  );
}
