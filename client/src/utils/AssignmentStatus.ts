export const AssignmentStatus = {
  Submitted: 'Submitted',
  Assigned: 'Assigned',
  Overdue: 'Overdue' 
} as const
export type AssignmentStatus = typeof AssignmentStatus[keyof typeof AssignmentStatus]