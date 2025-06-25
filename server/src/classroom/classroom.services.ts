import classroomUtils from "./classroom.utils"
import authServices from "../auth/auth.services"
import db from "../database/prisma"

/**
 * This function takes in a classroom id and uses
 * Prisma's ORM to return the classroom object.
 * 
 * @param id - The id of the classroom.
 * @returns - The classroom object from the database.
 */
const findClassroomById = async (id: string) => {
  return await db.classroom.findUnique({
    where: {
      id
    }
  })
}

/**
 * This function takes in a professor's id and uses
 * Prisma's ORM to return all classrooms taught by that professor.
 * 
 * @param professorId - The id of the professor.
 * @returns - An array of classroom objects from the database.
 */
const findAllClassroomsByProfessorId = async (professorId: string) => {
  return await db.classroom.findMany({
    where: {
      professorId
    }
  })
}

/**
 * This function takes in a class code and uses
 * Prisma's ORM to return the classroom object.
 * 
 * @param classCode - The code of the classroom.
 * @returns - The classroom object from the database.
 */
const findClassroomByClassCode = async (classCode: string) => {
  return await db.classroom.findUnique({
    where: {
      classCode
    }
  })
}

/**
 * This function takes in a classroom id and uses
 * Prisma's ORM to return all students in that classroom.
 * 
 * @param id - The id of the classroom.
 * @returns - An array of student objects from the database.
 */
const findAllStudentsByClassId = async (id: string) => {
  return await db.classroom.findUnique({
    where: {
      id
    },
    select: {
      students: true
    }
  })
}

/**
 * This function takes in a classroom id and uses
 * Prisma's ORM to return the professor of that classroom.
 * 
 * @param id - The id of the classroom.
 * @returns - The professor object from the database.
 */
const findProfessorByClassId = async (id: string) => {
  return await db.classroom.findUnique({
    where: {
      id
    },
    select: {
      professor: true
    }
  })
}

/**
 * This function creates a new classroom with the provided
 * section, time, days, and professor, and returns the new classroom object.
 * 
 * @param sectionId - The section id of the classroom.
 * @param startTime - The start time of the class.
 * @param endTime - The end time of the class.
 * @param days - The days the class meets.
 * @param professorId - The id of the professor teaching the class.
 * @returns - The newly created classroom object from the database.
 */
const createClassroom = async (
  sectionId: string, 
  startTime: Date, 
  endTime: Date, 
  days: Date,
  professorId: string
) => {
  const classroom = await db.classroom.create({
    data: {
      classCode: classroomUtils.generateClassId(),
      sectionId: sectionId,
      startTime: startTime,
      endTime: endTime,
      days: days,
      professorId: professorId
    }
  })
  await db.user.update({
    where: {
      id: professorId
    },
    data: {
      professorClassrooms: {
        create: classroom
      }
    }
  })
  return classroom
}

/**
 * This function adds a student to a classroom by updating
 * the classroom's student list and the student's classroom list.
 * 
 * @param id - The id of the classroom.
 * @param studentId - The id of the student to add.
 * @returns - The updated classroom object from the database.
 */
const addStudentToClassroom = async (id: string, studentId: string) => {
  const user = await authServices.findUserById(studentId)
  if (user) {
    const classroom = await db.classroom.update({
      where: {
        id
      },
      data: {
        students: {
          create: user
        }
      }
    })
    await db.user.update({
      where: {
        id: studentId
      },
      data: {
        studentClassrooms: {
          create: classroom
        }
      }
    })
    return classroom
  }
}