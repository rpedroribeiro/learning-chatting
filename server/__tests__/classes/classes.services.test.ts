import { UserRole, FileType } from "@prisma/client"
import { createMockContext, MockContext } from "../../src/context/mockContext"
import classService from "../../src/classes/classes.services"
import mockData from "../mockData"

let mockCtx: MockContext
beforeEach(() => {
  mockCtx = createMockContext()
})

test('findClassById returns the class with the matching Id', async () => {
  mockCtx.prisma.classes.findUnique.mockResolvedValue(mockData.mockClass)
  const result = await classService.findClassById("1", mockCtx)
  expect(result).toMatchObject(mockData.mockClass)
})

test('findAllClassesByProfessorId returns the classes matching the professor Id', async () => {
  mockCtx.prisma.classes.findMany.mockResolvedValue([mockData.mockClass])
  const result = await classService.findAllClassesByProfessorId("1", mockCtx)
  expect(result).toMatchObject([mockData.mockClass])
})

test('findAllClassesByStudentId returns the classes matching the student Id', async () => {
  mockCtx.prisma.classes.findMany.mockResolvedValue([mockData.mockClass])
  const result = await classService.findAllClassesByStudentId("2", mockCtx)
  expect(result).toMatchObject([mockData.mockClass])
})

test('findClassByClassCode returns the class with the matching class code', async () => {
  mockCtx.prisma.classes.findUnique.mockResolvedValue(mockData.mockClass)
  const result = await classService.findClassByClassCode("2FU4Z1", mockCtx)
  expect(result).toMatchObject(mockData.mockClass)
})

test('findAllStudentsByClassId returns the students matching the class Id', async () => {
  mockCtx.prisma.classes.findUnique.mockResolvedValue(mockData.mockClass)
  const result = await classService.findAllStudentsByClassId("1", mockCtx)
  expect(result).toMatchObject(mockData.mockClass)
})

test('findProfessorByClassId returns the professor matching the class Id', async () => {
  mockCtx.prisma.classes.findUnique.mockResolvedValue(mockData.mockClass)
  const result = await classService.findProfessorByClassId("1", mockCtx)
  expect(result).toMatchObject(mockData.mockClass)
})

test('createClass creates a brand new class with all necessary fields', async () => {
  mockCtx.prisma.classes.create.mockResolvedValue(mockData.mockClass)
  const result = await classService.createClass(
    mockData.mockClass.className,
    mockData.mockClass.sectionId,
    mockData.mockClass.startTimes,
    mockData.mockClass.endTimes,
    mockData.mockClass.professorId,
    mockCtx
  )
  expect(result).toMatchObject(mockData.mockClass)
  expect(mockCtx.prisma.user.update).toHaveBeenCalledWith({
    where: { id: mockData.mockClass.professorId },
    data: {
      professorClasses: {
        connect: { id: mockData.mockClass.id }
      }
    }
  })
})

test('addStudentToClass adds the student to the class with the matching Id studentList', async () => {
  mockCtx.prisma.classes.update.mockResolvedValue(mockData.mockClass)
  const result = await classService.addStudentToClass(
    mockData.mockClass.id,
    mockData.mockStudent.id,
    mockCtx
  )
  expect(result).toMatchObject(mockData.mockClass)
  expect(mockCtx.prisma.user.update).toHaveBeenCalledWith({
    where: { id: mockData.mockStudent.id },
    data: {
      studentClasses: {
        connect: { id: mockData.mockClass.id }
      }
    }
  })
})

test('findClassByUserIdAndClassId with student ID', async () => {
  mockCtx.prisma.classes.findUnique.mockResolvedValue(mockData.mockClass)
  const result = await classService.findClassByUserIdAndClassId(
    mockData.mockClass.id,
    mockData.mockStudent.id,
    null,
    mockCtx
  )
  expect(result).toMatchObject(mockData.mockClass)
  expect(mockCtx.prisma.classes.findUnique).toHaveBeenCalledWith({
    where: {
      id: mockData.mockClass.id,
      students: {
        some: {
          id: mockData.mockStudent.id
        }
      }
    },
    include: {
      rootFile: true
    }
  })
})

test('findClassByUserIdAndClassId with professor ID', async () => {
  mockCtx.prisma.classes.findUnique.mockResolvedValue(mockData.mockClass)
  const result = await classService.findClassByUserIdAndClassId(
    mockData.mockClass.id,
    null,
    mockData.mockProfessor.id,
    mockCtx
  )
  expect(result).toMatchObject(mockData.mockClass)
  expect(mockCtx.prisma.classes.findUnique).toHaveBeenCalledWith({
    where: {
      id: mockData.mockClass.id,
      professor: {
        id: mockData.mockProfessor.id
      }
    },
    include: {
      rootFile: true
    }
  })
})