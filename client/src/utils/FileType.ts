export const FileType = {
  Folder: 'Folder',
  File: 'File',
} as const;
export type FileType = typeof FileType[keyof typeof FileType]