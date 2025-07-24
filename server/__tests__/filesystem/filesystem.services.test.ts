import { FileType, UserRole } from "@prisma/client"
import { createMockContext, MockContext } from "../../src/context/mockContext"
import fileSystemServices from "../../src/filesystem/filesystem.services"
import mockData from "../mockData"

let mockCtx: MockContext
beforeEach(() => {
  mockCtx = createMockContext()
})

test('createFileSystemItem creates a brand new file system item', async () => {
  mockCtx.prisma.fileSystemItem.create.mockResolvedValue(mockData.mockRootFile)
  const result = await fileSystemServices.createFileSystemItem(
    mockData.mockRootFile.name,
    mockData.mockRootFile.fileURL,
    mockData.mockRootFile.type as FileType,
    null,
    mockData.mockClass.id,
    mockCtx
  )
  expect(result).toMatchObject(mockData.mockRootFile)
})

test('findFileSystemItemById returns the file system item with the matching Id', async () => {
  mockCtx.prisma.fileSystemItem.findUnique.mockResolvedValue(mockData.mockRootFile)
  const result = await fileSystemServices.findFileSystemItemById("1", mockCtx)
  expect(result).toMatchObject(mockData.mockRootFile)
})

test('findAllChidrenForFileSystemItem returns all the children of the file system item with the matching Id', async () => {
  mockCtx.prisma.fileSystemItem.findMany.mockResolvedValue([mockData.mockRootFile])
  const result = await fileSystemServices.findAllChidrenForFileSystemItem("1", mockCtx)
  expect(result).toMatchObject([mockData.mockRootFile])
})

test('findRootFileSystemItem returns the root file system item', async () => {
  mockCtx.prisma.fileSystemItem.findUnique.mockResolvedValue(mockData.mockRootFile)
  const result = await fileSystemServices.findRootFileSystemItem("1", mockCtx)
  expect(result).toMatchObject(mockData.mockRootFile)
})