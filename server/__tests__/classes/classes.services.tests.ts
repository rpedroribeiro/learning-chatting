import { UserRole } from "@prisma/client"
import { createMockContext, MockContext } from "../../src/context/mockContext"
import classService from "../../src/classes/classes.services"

let mockCtx: MockContext
beforeEach(() => {
  mockCtx = createMockContext()
})

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
  startTimes,
  endTimes,
  professorId: "1",
  professor: mockProfessor,
  students: [mockStudent],
}

test('findClassById returns the class with the matching Id', async () => {
  mockCtx.prisma.classes.findUnique.mockResolvedValue(mockClass)
  const result = await classService.findClassById("1", mockCtx)
  expect(result).toMatchObject(mockClass)
})

test('findAllClassesByProfessorId returns the classes matching the professor Id', async () => {
  mockCtx.prisma.classes.findMany.mockResolvedValue([mockClass])
  const result = await classService.findAllClassesByProfessorId("1", mockCtx)
  expect(result).toMatchObject([mockClass])
})

test('findAllClassesByStudentId returns the classes matching the student Id', async () => {
  mockCtx.prisma.classes.findMany.mockResolvedValue([mockClass])
  const result = await classService.findAllClassesByStudentId("2", mockCtx)
  expect(result).toMatchObject([mockClass])
})

test('findClassByClassCode returns the class with the matching class code', async () => {
  mockCtx.prisma.classes.findUnique.mockResolvedValue(mockClass)
  const result = await classService.findClassByClassCode("2FU4Z1", mockCtx)
  expect(result).toMatchObject(mockClass)
})

test('findAllStudentsByClassId returns the students matching the class Id', async () => {
  mockCtx.prisma.classes.findUnique.mockResolvedValue(mockClass)
  const result = await classService.findAllStudentsByClassId("1", mockCtx)
  expect(result).toMatchObject(mockClass)
})

test('findProfessorByClassId returns the professor matching the class Id', async () => {
  mockCtx.prisma.classes.findUnique.mockResolvedValue(mockClass)
  const result = await classService.findProfessorByClassId("1", mockCtx)
  expect(result).toMatchObject(mockClass)
})

test('createClass creates a brand new class with all necessary fields', async () => {
  mockCtx.prisma.classes.create.mockResolvedValue(mockClass)
  const result = await classService.createClass(
    mockClass.className,
    mockClass.sectionId,
    mockClass.startTimes,
    mockClass.endTimes,
    mockClass.professorId,
    mockCtx
  )
  expect(result).toMatchObject(mockClass)
  expect(mockCtx.prisma.user.update).toHaveBeenCalledWith({
    where: { id: mockClass.professorId },
    data: {
      professorClasses: {
        connect: { id: mockClass.id }
      }
    }
  })
})

test('addStudentToClass adds the student to the class with the matching Id studentList', async () => {
  mockCtx.prisma.classes.update.mockResolvedValue(mockClass)
  const result = await classService.addStudentToClass(
    mockClass.id,
    mockStudent.id,
    mockCtx
  )
  expect(result).toMatchObject(mockClass)
  expect(mockCtx.prisma.user.update).toHaveBeenCalledWith({
    where: { id: mockStudent.id },
    data: {
      studentClasses: {
        connect: { id: mockClass.id }
      }
    }
  })
})

test('findClassByUserIdAndClassId with student ID', async () => {
  mockCtx.prisma.classes.findUnique.mockResolvedValue(mockClass)
  const result = await classService.findClassByUserIdAndClassId(
    mockClass.id,
    mockStudent.id,
    null,
    mockCtx
  )
  expect(result).toMatchObject(mockClass)
  expect(mockCtx.prisma.classes.findUnique).toHaveBeenCalledWith({
    where: {
      id: mockClass.id,
      students: {
        some: {
          id: mockStudent.id
        }
      }
    }
  })
})

test('findClassByUserIdAndClassId with professor ID', async () => {
  mockCtx.prisma.classes.findUnique.mockResolvedValue(mockClass)
  const result = await classService.findClassByUserIdAndClassId(
    mockClass.id,
    null,
    mockProfessor.id,
    mockCtx
  )
  expect(result).toMatchObject(mockClass)
  expect(mockCtx.prisma.classes.findUnique).toHaveBeenCalledWith({
    where: {
      id: mockClass.id,
      professor: {
        id: mockProfessor.id
      }
    }
  })
})