import { assignmentStatus, assignmentType } from '@/types/assignment';
import { accountType, role } from '@/types/user';

const getAssignmentStatus = (assignment: assignmentType, user?: accountType): assignmentStatus => {
  const now = new Date();
  const available = new Date(assignment?.available_datetime);
  const due = new Date(assignment?.due_datetime);
  //unexpanded Submission
  const unexpandedSubmission = assignment.submissions?.some((s) => s.created_by === user?.id);
  //expanded submission
  const expandedSubmission = assignment.submissions?.some((s) => s.created_by.id === user?.id);

  //locked
  if (now < available) return assignmentStatus.locked;

  //overdue to submit + not submitted
  if (now > due && user?.roles.includes(role.student)) return assignmentStatus.overdue;

  //ready to be graded
  if (user?.roles.includes(role.teacher) && due > now) return assignmentStatus.ready_to_be_graded;

  //submitted (overdue + submitted)
  if (now > due && user?.roles.includes(role.student) && unexpandedSubmission && expandedSubmission)
    return assignmentStatus.overdue;

  if (expandedSubmission) return assignmentStatus.submitted;

  if (unexpandedSubmission) return assignmentStatus.submitted;

  //available to submit
  if (now >= available && now <= due && user?.roles.includes(role.student))
    return assignmentStatus.available_to_submit;

  //graded
  //required resubmission
  //default
  return assignmentStatus.locked;
};

export { getAssignmentStatus };
