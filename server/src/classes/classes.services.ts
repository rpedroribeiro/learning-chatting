import classroomUtils from "./classes.utils"
import { Context } from '../context/context'
import { FileType } from "@prisma/client"
import fileSystemServices from "../filesystem/filesystem.services"
import gcpBucketUtils from "../gcpbucket/gcpbucket.utils"

/**
 * This function takes in a class id and uses
 * Prisma's ORM to return the class object.
 * 
 * @param id - The id of the class.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - The class object from the database.
 */
const findClassById = async (id: string, ctx: Context) => {
  return await ctx.prisma.classes.findUnique({
    where: {
      id
    }
  })
}

/**
 * This function takes in a professor's id and uses
 * Prisma's ORM to return all class taught by that professor.
 * 
 * @param professorId - The id of the professor.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - An array of class objects from the database.
 */
const findAllClassesByProfessorId = async (professorId: string, ctx: Context) => {
  return await ctx.prisma.classes.findMany({
    where: {
      professorId
    },
    include: {
      professor: true
    }
  })
}

/**
 * This function takes in a students's id and uses
 * Prisma's ORM to return all class the student is signed
 * up for.
 * 
 * @param userId - The id of the professor.
 * @returns - An array of class objects from the database.
 */
const findAllClassesByStudentId = async (studentId: string, ctx: Context) => {
  return await ctx.prisma.classes.findMany({
    where: {
      students: {
        some: {
          id: studentId
        }
      }
    },
    include: {
      professor: true
    }
  })
}

/**
 * This function takes in a class code and uses
 * Prisma's ORM to return the class object.
 *
 * @param classCode - The code of the class.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - The class object from the database.
 */
const findClassByClassCode = async (classCode: string, ctx: Context) => {
  return await ctx.prisma.classes.findUnique({
    where: {
      classCode
    }
  })
}

/**
 * This function takes in a class id and uses
 * Prisma's ORM to return all students in that class.
 * 
 * @param id - The id of the class.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - An array of student objects from the database.
 */
const findAllStudentsByClassId = async (id: string, ctx: Context) => {
  return await ctx.prisma.classes.findUnique({
    where: {
      id
    },
    select: {
      students: true
    }
  })
}

/**
 * This function takes in a class id and uses
 * Prisma's ORM to return the professor of that class.
 * 
 * @param id - The id of the class.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - The professor object from the database.
 */
const findProfessorByClassId = async (id: string, ctx: Context) => {
  return await ctx.prisma.classes.findUnique({
    where: {
      id
    },
    select: {
      professor: true
    }
  })
}

/**
 * This function creates a new class with the provided
 * section, time, days, and professor, and returns the new class object.
 * 
 * @param sectionId - The section id of the class.
 * @param startTimes - A list of the start times of the class.
 * @param endTimes - A list of the end times of the class.
 * @param days - The days the class meets.
 * @param professorId - The id of the professor teaching the class.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - The newly created class object from the database.
 */
const createClass = async (
  className: string,
  sectionId: string, 
  startTimes: Date[], 
  endTimes: Date[], 
  professorId: string,
  ctx: Context
) => {
  const newClass = await ctx.prisma.classes.create({
    data: {
      classCode: classroomUtils.generateClassId(),
      className: className,
      sectionId: sectionId,
      startTimes: startTimes,
      endTimes: endTimes,
      professorId: professorId,
    }
  })
  await fileSystemServices.createFileSystemItem(
    `${sectionId}_root`,
    `file_system/${sectionId}_root/`,
    FileType.Folder,
    null,
    newClass.id,
    ctx
  )
  await gcpBucketUtils.addFolderToFileSystem(`file_system/${sectionId}_root/`)
  await ctx.prisma.user.update({
    where: {
      id: professorId
    },
    data: {
      professorClasses: {
        connect: { id: newClass.id }
      }
    }
  })
  return newClass
}

/**
 * This function adds a student to a class by updating
 * the class' student list and the student's class list.
 * 
 * @param id - The id of the class.
 * @param studentId - The id of the student to add.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - The updated class object from the database.
 */
const addStudentToClass = async (id: string, studentId: string, ctx: Context) => {
  const newClass = await ctx.prisma.classes.update({
    where: {
      id
    },
    data: {
      students: {
        connect: { id: studentId }
      }
    }
  })
  await ctx.prisma.user.update({
    where: {
      id: studentId
    },
    data: {
      studentClasses: {
        connect: { id: id }
      }
    }
  })
  return newClass
}

/**
 * This function looks for the class inside the users class list,
 * regardless of the role of the user. This function takes in all the
 * necessary ids to find the right class and return it.
 * 
 * @param classId - The id of the desired class.
 * @param studentId - The id of the student, can be null.
 * @param professorId - The id of the professor, can be null.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - The class specified from the class id.
 */
const findClassByUserIdAndClassId = async (
  classId: string,
  studentId: string | null,
  professorId: string | null,
  ctx: Context
) => {
  let currClass
  if (studentId) {
    currClass = await ctx.prisma.classes.findUnique({
      where: {
        id: classId,
        students: {
          some: {
            id: studentId
          }
        }
      },
      include: {
        rootFile: true
      }
    })
  } else if (professorId) {
    currClass = await ctx.prisma.classes.findUnique({
      where: {
        id: classId,
        professor: {
          id: professorId
        }
      },
      include: {
        rootFile: true
      }
    })
  }
  return currClass
}

const classService = {
  findClassById,
  findAllClassesByProfessorId,
  findAllClassesByStudentId,
  findClassByClassCode,
  findAllStudentsByClassId,
  findProfessorByClassId,
  createClass,
  addStudentToClass,
  findClassByUserIdAndClassId
}

export default classService