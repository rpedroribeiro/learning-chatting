export const FileType = {
  Folder: 'Folder',
  File: 'File',
} as const;
export type UserRole = typeof FileType[keyof typeof FileType]