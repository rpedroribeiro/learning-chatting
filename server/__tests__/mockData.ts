import { FileType, UserRole } from "@prisma/client"

test.skip('loaded mockData', () => {})

const currentDate = new Date()

const startTimes = [
  new Date('2025-09-01T08:00:00Z'),
  new Date('2025-09-03T08:00:00Z'),
  new Date('2025-09-05T08:00:00Z'),
]

const endTimes = [
  new Date('2025-09-01T09:30:00Z'),
  new Date('2025-09-03T09:30:00Z'),
  new Date('2025-09-05T09:30:00Z'),
]

const refreshToken = 'refresh-token'
const hashedToken = 'hashed-refresh-token'

const mockUser = {
  id: "1",
  email: 'test@gmail.com',
  password: '12345678',
  firstName: 'test',
  lastName: 'user',
  accountType: UserRole.Professor,
  socketId: null,
  createdAt: currentDate,
  updatedAt: currentDate
}

const mockProfessor = {
  id: "1",
  email: 'professor@gmail.com',
  password: '12345678',
  firstName: 'professor',
  lastName: 'user',
  accountType: UserRole.Professor,
  createdAt: currentDate,
  updatedAt: currentDate
}

const mockStudent = {
  id: "2",
  email: 'student@gmail.com',
  password: '12345678',
  firstName: 'student',
  lastName: 'user',
  accountType: UserRole.Student,
  createdAt: currentDate,
  updatedAt: currentDate
}

const mockRefreshToken = {
  id: '1',
  createdAt: currentDate,
  updatedAt: currentDate,
  hashedToken,
  userId: '1',
  revoked: false,
  expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
}

const mockClass = {
  id: "1",
  classCode: "2FU4Z1",
  sectionId: "23651",
  className: "Math 101 - Calculus I",
  professorId: "1",
  startTimes,
  endTimes,
  professor: mockProfessor,
  students: [mockStudent],
}

const mockRootFile = {
  id: "1",
  name: "root",
  type: FileType.Folder,
  classId: mockClass.id,
  class: mockClass,
  parentId: null,
  parent: null,
  fileURL: "example/path/to/folder/",
  createdAt: currentDate,
  children: null
}

const mockSubmission = {
  student: {
    id: mockStudent.id,
    firstName: mockStudent.firstName,
    lastName: mockStudent.lastName,
  }
}

const mockAssignment = {
  id: "1",
  name: "Example Assignment",
  description: "This is an example assignment",
  classId: mockClass.id,
  dueDate: new Date('2025-09-01T09:30:00Z'),
  files: ["example/file/path"],
  createdAt: currentDate,
  submissions: [mockSubmission],
}

const completeMockSubmission = {
  id: "1",
  classId: mockClass.id,
  assignmentId: mockAssignment.id,
  submitted: false,
  studentId: mockStudent.id,
  submissionTime: null,
  uploadedFiles: ['file'],
  createdAt: currentDate
}

const mockData = {
  mockUser,
  mockProfessor,
  mockStudent,
  mockRefreshToken,
  mockClass,
  mockRootFile,
  mockSubmission,
  mockAssignment,
  completeMockSubmission
}

export default mockData