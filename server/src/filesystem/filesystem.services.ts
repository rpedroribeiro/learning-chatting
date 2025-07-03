import { Context } from "../context/context"
import { FileType } from "@prisma/client"

/**
 * This function creates a new file system item. The two optional
 * parameters help determine if the current item is the root directory
 * of a class or not, being true when classId is not null and being false
 * when parentId is not null. parentId and classId cannot both be not null.
 * 
 * @param fileName - The desired name of the file.
 * @param fileUrl - The file url used to access it in GCB.
 * @param fileType - Either a file or a folder.
 * @param parentId - The item's parent.
 * @param classId - The class Id of the root directory.
 * @param ctx - The prisma context that this function is being used in.
 * @returns 
 */
const createFileSystemItem = async (
  fileName: string,
  fileUrl: string,
  fileType: FileType,
  parentId: string | null,
  classId: string | null,
  ctx: Context
) => {
  return await ctx.prisma.fileSystemItem.create({
    data: {
      name: fileName,
      type: fileType,
      fileURL: fileUrl,
      parentId: parentId || null,
      classId: classId || null
    }
  })
}

/**
 * This function looks at all stored fileSystemItems and returns the
 * object of the desired item based off the given id.
 * 
 * @param id - The id of the desired item
 * @param ctx - The prisma context that this function is being used in.
 * @returns 
 */
const findFileSystemItemById = async (id: string, ctx: Context) => {
  return await ctx.prisma.fileSystemItem.findUnique({
    where: {
      id
    },
    include: {
      children: true
    }
  })
}

/**
 * This funcction takes in the id of the current item and returns all of
 * its direct children one level below.
 * 
 * @param id - The id of the parent.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - A list of all the children inside the parent.
 */
const findAllChidrenForFileSystemItem = async (id: string, ctx: Context) => {
  return await ctx.prisma.fileSystemItem.findMany({
    where: {
      parentId: id
    }
  })
}

/**
 * This function takes in the currId of the FileSystemItem and uses it to
 * continuously navigate until the root FileSystemItem and returns it.
 * 
 * @param currId - The id of the current FileSystemItem
 * @param ctx - The prisma context that this function is being used in.
 * @returns 
 */
const findRootFileSystemItem = async (currId: string, ctx: Context) => {
  let currentFileSystemItem = await ctx.prisma.fileSystemItem.findUnique({
    where: {
      id: currId
    }
  })

  while (currentFileSystemItem?.parentId) {
    currentFileSystemItem = await ctx.prisma.fileSystemItem.findUnique({
      where: {
        id: currentFileSystemItem.parentId
      },
      include: {
        parent: true
      }
    })
  }
  return currentFileSystemItem
}

const fileSystemServices = {
  createFileSystemItem,
  findFileSystemItemById,
  findAllChidrenForFileSystemItem,
  findRootFileSystemItem
}

export default fileSystemServices