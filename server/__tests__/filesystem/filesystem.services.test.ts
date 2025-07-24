import { FileType, UserRole } from "@prisma/client"
import { createMockContext, MockContext } from "../../src/context/mockContext"
import fileSystemServices from "../../src/filesystem/filesystem.services"

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

test('createFileSystemItem creates a brand new file system item', async () => {
  mockCtx.prisma.fileSystemItem.create.mockResolvedValue(mockRootFile)
  const result = await fileSystemServices.createFileSystemItem(
    mockRootFile.name,
    mockRootFile.fileURL,
    mockRootFile.type as FileType,
    null,
    mockClass.id,
    mockCtx
  )
  expect(result).toMatchObject(mockRootFile)
})

test('findFileSystemItemById returns the file system item with the matching Id', async () => {
  mockCtx.prisma.fileSystemItem.findUnique.mockResolvedValue(mockRootFile)
  const result = await fileSystemServices.findFileSystemItemById("1", mockCtx)
  expect(result).toMatchObject(mockRootFile)
})

test('findAllChidrenForFileSystemItem returns all the children of the file system item with the matching Id', async () => {
  mockCtx.prisma.fileSystemItem.findMany.mockResolvedValue([mockRootFile])
  const result = await fileSystemServices.findAllChidrenForFileSystemItem("1", mockCtx)
  expect(result).toMatchObject([mockRootFile])
})

test('findRootFileSystemItem returns the root file system item', async () => {
  mockCtx.prisma.fileSystemItem.findUnique.mockResolvedValue(mockRootFile)
  const result = await fileSystemServices.findRootFileSystemItem("1", mockCtx)
  expect(result).toMatchObject(mockRootFile)
})