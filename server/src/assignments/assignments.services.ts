import { Context } from "../context/context"
import classService from "../classes/classes.services"
import submissionServices from "./submission.services"

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
 * @returns 
 */
const createNewAssignment = async (
  assignmentName: string,
  assignmentDescription: string,
  classId: string,
  dueDate: Date,
  files: string[],
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
  }
}

const assignmentServices = {
  createNewAssignment
}

export default assignmentServices