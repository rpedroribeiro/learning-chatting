import { UserRole } from "./UserRole"

export const targetSentenceToRoute = new Map<string, [string, string, string[], Record<string, any>]>([
  ["get the filesystem file ''", ["get", "/:userId/class/:classId/filesystem/:itemName", ["itemName"], { itemName: ""}]],
  ["post the filesystem file ''", ["post", "", ["assignmentName"], { assignmentName: "" }]],
  ["get the filesystem folder ''", ["get", "/:userId/class/:classId/filesystem/:itemName", ["itemName"], { itemName: "" }]],
  ["post the filesystem folder ''", ["post", "", [], {}]],
  ["get the assignment '' information", ["get", "/:userId/class/:classId/assignment/:assignmentName", ["assignmentName"], { assignmentName: "" }]],
  ["get the assignment '' due date", ["get", "/:userId/class/:classId/assignment/:assignmentName", ["assignmentName", "dueDate"], { assignmentName: "", dueDate: true }]],
  ["get the assignment '' files", ["get", "/:userId/class/:classId/assignment/:assignmentName", ["assignmentName", "files"], { assignmentName: "", files: true }]],
  ["get all the assignment '' student submission", ["get", "/:userId/class/:classId/assignment/:assignmentName", ["assignmentName", "submission"], { assignmentName: "", submission: true, accountType: UserRole.Professor}]],
  ["get all the student submissions for assignment ''", ["get", "/:userId/class/:classId/assignment/:assignmentName", ["assignmentName", "submission", "accountType"], { assignmentName: "", submission: true, accountType: UserRole.Professor }]],
  ["get the assignment '' student submission ''", ["get", "/:userId/class/:classId/assignment/:assignmentName", ["assignmentName", "studentName", "submission", "accountType"], { assignmentName: "", studentName: "", submission: true, accountType: UserRole.Professor }]],
  ["get the student submission '' for assignment ''", ["get", "/:userId/class/:classId/assignment/:assignmentName", ["studentName", "assignmentName", "submission", "accountType"], { studentName: "", assignmentName: "", submission: true, accountType: UserRole.Professor }]],
  ["get the assignment '' my submission", ["get", "/:userId/class/:classId/assignment/:assignmentName", ["assignmentName", "submission", "accountType"], { assignmentName: "", submission: true, accountType: UserRole.Student }]],
  ["put the assignment ''", ["put", "/:userId/class/:classId/assignment/:assignmentName/submit", ["accountType"], { accountType: UserRole.Student }]],
  ["post the annoucement ''", ["post", "", [], {}]],
])