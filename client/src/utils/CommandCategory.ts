export const CommandCategory = {
  PostAnnoucement: 'PostAnnoucement',
  ViewAnnouncement: 'ViewAnnouncement',
  ViewStudentSubmission: 'ViewStudentSubmission',
  ViewAssignment: 'ViewAssignment',
  ViewFileSystemItem: 'ViewFileSystemItem',
  PingUser: 'PingUser'
} as const;
export type CommandCategory = typeof CommandCategory[keyof typeof CommandCategory]