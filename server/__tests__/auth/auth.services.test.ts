import { UserRole } from "@prisma/client"
import * as bcrypt from 'bcrypt'
import { createMockContext, MockContext } from "../../src/context/mockContext"
import authServices from '../../src/auth/auth.services'
import authJwt from "../../src/auth/auth.jwt"
import mockData from "../mockData"

let mockCtx: MockContext
beforeEach(() => {
  mockCtx = createMockContext()
})

const currentDate = new Date()
const refreshToken = 'refresh-token'
const hashedToken = 'hashed-refresh-token'

test('createUserByEmailAndPassword creates a new user with hashed password', async () => {
  const hashedPassword = await bcrypt.hash(mockData.mockUser.password, 12)
  mockCtx.prisma.user.create.mockResolvedValue({
    ...mockData.mockUser,
    password: hashedPassword,
  })
  const result = await authServices.createUserByEmailAndPassword(mockData.mockUser, mockCtx)
  expect(await bcrypt.compare('12345678', result.password)).toBe(true)
  expect(result).toMatchObject({
    id: "1",
    email: 'test@gmail.com',
    firstName: 'test',
    lastName: 'user',
    accountType: UserRole.Professor,
    createdAt: currentDate,
    updatedAt: currentDate
  })
})

test('findUserById returns the user object with the matching Id', async () => {
  mockCtx.prisma.user.findUnique.mockResolvedValue(mockData.mockUser)
  const result = await authServices.findUserById("1", mockCtx)
  expect(result).toMatchObject(mockData.mockUser)
})

test('findUserByEmail returns the user object with the matching email', async () => {
  mockCtx.prisma.user.findUnique.mockResolvedValue(mockData.mockUser)
  const result = await authServices.findUserById("test@gmail.com", mockCtx)
  expect(result).toMatchObject(mockData.mockUser)
})

test('addRefreshTokenToWhiteList adds a new refresh token to the whitelist', async () => {
  mockCtx.prisma.refreshToken.create.mockResolvedValue(mockData.mockRefreshToken)
  jest.spyOn(authJwt, 'hashToken').mockReturnValue(hashedToken)
  const result = await authServices.addRefreshTokenToWhiteList(refreshToken, mockData.mockUser.id, mockCtx)
  expect(result).toMatchObject(mockData.mockRefreshToken)
})

test('findRefreshToken finds a refresh token by its token string', async () => {
  mockCtx.prisma.refreshToken.findUnique.mockResolvedValue(mockData.mockRefreshToken)
  jest.spyOn(authJwt, 'hashToken').mockReturnValue(hashedToken)
  const result = await authServices.findRefreshToken(refreshToken, mockCtx)
  expect(result).toMatchObject(mockData.mockRefreshToken)
})

test('deleteRefreshTokenById deletes a refresh token by its ID', async () => {
  const deletedToken = { ...mockData.mockRefreshToken, revoked: true }
  mockCtx.prisma.refreshToken.update.mockResolvedValue(deletedToken)
  const result = await authServices.deleteRefreshTokenById(mockData.mockRefreshToken.id, mockCtx)
  expect(result).toMatchObject(deletedToken)
})

test('revokeTokens revokes all refresh tokens for a user', async () => {
  mockCtx.prisma.refreshToken.updateMany.mockResolvedValue({ count: 2 })
  const result = await authServices.revokeTokens(mockData.mockUser.id, mockCtx)
  expect(result).toEqual({ count: 2 })
  expect(result.count).toBe(2)
})