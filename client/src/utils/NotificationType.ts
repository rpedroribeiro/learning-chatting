export const NotificationType = {
  AssignmentPosted: 'AssignmentPosted',
  StudentSubmission: 'StudentSubmission',
  FileSystemItemCreated: 'FileSystemItemCreated',
  AnnouncementPosted: 'AnnouncementPosted'
} as const;
export type NotificationType = typeof NotificationType[keyof typeof NotificationType]