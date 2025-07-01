export const UserRole = {
  Professor: 'Professor',
  Student: 'Student',
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole]