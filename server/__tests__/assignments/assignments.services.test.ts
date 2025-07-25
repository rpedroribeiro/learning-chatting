import { createMockContext, MockContext } from "../../src/context/mockContext"
import { UserRole } from "@prisma/client"
import classService from "../../src/classes/classes.services"
import submissionServices from "../../src/submissions/submission.services"
import assignmentServices from "../../src/assignments/assignments.services"
import mockData from "../mockData"

let mockCtx: MockContext
beforeEach(() => {
  mockCtx = createMockContext()
})

describe("assignmentServices", () => {
  test('createNewAssignment creates a brand new assignment and submissions', async () => {
    classService.findAllStudentsByClassId = jest.fn().mockResolvedValue({ students: [mockData.mockStudent] })
    submissionServices.createSubmissionForAssignment = jest.fn().mockResolvedValue({ ...mockData.mockSubmission })

    mockCtx.prisma.assignment.create.mockResolvedValue(mockData.mockAssignment)

    const result = await assignmentServices.createNewAssignment(
      mockData.mockAssignment.name,
      mockData.mockAssignment.description,
      mockData.mockAssignment.classId,
      mockData.mockAssignment.dueDate,
      mockData.mockAssignment.files,
      mockCtx
    )

    expect(result).toMatchObject(mockData.mockAssignment)
    expect(classService.findAllStudentsByClassId).toHaveBeenCalledWith(mockData.mockClass.id, mockCtx)
    expect(submissionServices.createSubmissionForAssignment).toHaveBeenCalledWith(
      mockData.mockAssignment.id,
      mockData.mockStudent.id,
      mockCtx
    )
  })

  test('findAllAssignmentsByClassId returns all assignments for a class', async () => {
    mockCtx.prisma.assignment.findMany.mockResolvedValue([mockData.mockAssignment])
    const result = await assignmentServices.findAllAssignmentsByClassId(
      mockData.mockStudent.id,
      mockData.mockClass.id,
      mockCtx
    )
    expect(result).toMatchObject([mockData.mockAssignment])
  })

  test('findAllSubmissionByAssignmentId returns all submissions for an assignment', async () => {
    mockCtx.prisma.assignment.findUnique.mockResolvedValue({
      ...mockData.mockAssignment,
    })
    const result = await assignmentServices.findAllSubmissionByAssignmentId(
      mockData.mockAssignment.id,
      mockCtx
    )
    expect(result).toMatchObject({
      ...mockData.mockAssignment,
      submissions: [mockData.mockSubmission]
    })
  })

  test('findAllSubmissionsByAssignmentName returns all submissions for an assignment by name', async () => {
    mockCtx.prisma.assignment.findFirst.mockResolvedValue({
      ...mockData.mockAssignment,
    })
    const result = await assignmentServices.findAllSubmissionsByAssignmentName(
      mockData.mockAssignment.name,
      mockCtx
    )
    expect(result).toMatchObject({
      ...mockData.mockAssignment,
    })
  })

  test('findAssignmentById returns assignment and student\'s submission', async () => {
    mockCtx.prisma.assignment.findUnique.mockResolvedValue({
      ...mockData.mockAssignment,
    })
    const result = await assignmentServices.findAssignmentById(
      mockData.mockStudent.id,
      mockData.mockAssignment.id,
      mockCtx
    )
    expect(result).toMatchObject({
      ...mockData.mockAssignment,
    })
  })

  test('findAssignmentByName returns assignment and student\'s submission', async () => {
    mockCtx.prisma.assignment.findFirst.mockResolvedValue({
      ...mockData.mockAssignment,
    })
    const result = await assignmentServices.findAssignmentByName(
      mockData.mockStudent.id,
      mockData.mockAssignment.name,
      mockCtx
    )
    expect(result).toMatchObject({
      ...mockData.mockAssignment,
    })
  })
})