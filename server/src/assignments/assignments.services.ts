import { Context } from "../context/context"
import classService from "../classes/classes.services"
import submissionServices from "../submissions/submission.services"
import { UserRole } from "@prisma/client"

/**
 * This function takes in all the necessary information to create a new
 * assignment. This function also finds all the students in the class
 * using the classId and makes a submission instance for each one.
 * 
 * @param assignmentName - The desired name of the assignment.
 * @param assignmentDescription - The desired description of the assignment.
 * @param classId - The classId of the assignment.
 * @param dueDate - The date the assignment is due.
 * @param files - Any supporting files needed to complete the assignment.
 * @param ctx - The prisma context that this function is being used in.
 */
const createNewAssignment = async (
  assignmentName: string,
  assignmentDescription: string,
  classId: string,
  dueDate: Date,
  files: string[] | undefined,
  ctx: Context
) => {
  const classStudents = await classService.findAllStudentsByClassId(classId, ctx)
  if (classStudents) {
    const newAssignemt = await ctx.prisma.assignment.create({
      data: {
        name: assignmentName,
        description: assignmentDescription,
        classId: classId,
        dueDate: dueDate,
        files: files,
      }
    })
    for (const student of classStudents?.students) {
      await submissionServices.createSubmissionForAssignment(
        newAssignemt.id,
        student.id,
        ctx
      )
    }
    return newAssignemt
  }
}

/**
 * This functions finds and returns all the assignments instances related
 * to the class using the class id.
 * 
 * @param classId - The classId used to find all related assignments.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - A list of all the assignments for the class
 */
const findAllAssignmentsByClassId = async (
  studentId: string | null,
  classId: string,
  ctx: Context
) => {
  if (studentId) {
    return await ctx.prisma.assignment.findMany({
      where: {
        classId: classId
      },
      include: {
        submissions: {
          where: {
            studentId: studentId
          }
        }
      }
    })
  } else {
    return await ctx.prisma.assignment.findMany({
      where: {
        classId: classId
      }
    })
  }
  
}

/**
 * This functions finds and returns all the submissions instances related
 * to the assignment using the assignment id, also includes basic student
 * information for each submission.
 * 
 * @param assignmentId - The assignmentId used to find all related submissions.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - A list of all the submission for the assignment
 */
const findAllSubmissionByAssignmentId = async (
  assignmentId: string,
  ctx: Context
) => {
  return await ctx.prisma.assignment.findUnique({
    where: {
      id: assignmentId
    },
    include: {
      submissions: {
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  })
}

/**
 * This functions finds and returns all the submissions instances related
 * to the assignment using the assignment name, also includes basic student
 * information for each submission.
 * 
 * @param assignmentName - The assignment name used to find all related submissions.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - A list of all the submission for the assignment
 */
const findAllSubmissionsByAssignmentName = async (
  assignmentName: string,
  ctx: Context
) => {
  return await ctx.prisma.assignment.findFirst({
    where: {
      name: assignmentName
    },
    include: {
      submissions: {
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  })
}

/**
 * This function returns all the assignment information necessary for the
 * student, which includes the assignment name, description, uploaded files,
 * and the student's already uploaded files before/after submission.
 * 
 * @param assignmentId - The assignmentId used to find all assignment information.
 * @param studentId - The student making this request, used to find his submisison.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - A detailed object of the assignment and the student's submission.
 */
const findAssignmentById = async (
  studentId: string,
  assignmentId: string,
  ctx: Context
) => {
  return await ctx.prisma.assignment.findUnique({
    where: {
      id: assignmentId
    },
    include: {
      submissions: {
        where: {
          studentId: studentId
        }
      }
    }
  })
}

/**
 * This function returns all the assignment information necessary for the
 * student, which includes the assignment name, description, uploaded files,
 * and the student's already uploaded files before/after submission.
 * 
 * @param assignmentName - The name of the assignment used to find all assignment information.
 * @param studentId - The student making this request, used to find his submisison.
 * @param ctx - The prisma context that this function is being used in.
 * @returns - A detailed object of the assignment and the student's submission.
 */
const findAssignmentByName = async (
  studentId: string,
  assignmentName: string,
  ctx: Context
) => {
  return await ctx.prisma.assignment.findFirst({
    where: {
      name: assignmentName
    },
    include: {
      submissions: {
        where: {
          studentId: studentId
        },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  })
}

const assignmentServices = {
  createNewAssignment,
  findAllAssignmentsByClassId,
  findAllSubmissionByAssignmentId,
  findAssignmentById,
  findAssignmentByName,
  findAllSubmissionsByAssignmentName
}

export default assignmentServices