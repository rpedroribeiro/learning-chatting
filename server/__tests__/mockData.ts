import { UserRole } from "@prisma/client"

test.skip('loaded mockData', () => {})

const currentDate = new Date()

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

const mockClass = {
  id: "1",
  classCode: "2FU4Z1",
  sectionId: "23651",
  className: "Math 101 - Calculus I",
  professorId: "1",
  professor: mockProfessor,
  students: [mockStudent],
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

const mockData = {
  mockProfessor,
  mockStudent,
  mockClass,
  mockSubmission,
  mockAssignment
}

export default mockData