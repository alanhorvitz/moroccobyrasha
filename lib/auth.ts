import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { User, Session } from '@prisma/client'
import { registerSchema, loginSchema } from '@/types/user'
import { z } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const SALT_ROUNDS = 10

export type SafeUser = Omit<User, 'password'>

export class AuthService {
  // Register a new user
  static async register(userData: z.infer<typeof registerSchema>): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS)

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        language: userData.language,
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
        nationality: userData.nationality,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        interests: userData.interests || null,
      },
    })

    return this.sanitizeUser(user)
  }

  // Login user
  static async login(credentials: z.infer<typeof loginSchema>): Promise<{ user: SafeUser; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const isValid = await bcrypt.compare(credentials.password, user.password)

    if (!isValid) {
      throw new Error('Invalid password')
    }

    const token = this.generateToken(user)
    return { user: this.sanitizeUser(user), token }
  }

  // Get user by ID
  static async getUserById(id: number): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  // Update user
  static async updateUser(id: number, userData: Partial<User>): Promise<SafeUser> {
    const { password, ...updateData } = userData

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return this.sanitizeUser(user)
  }

  // Change password
  static async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.getUserById(userId)
    const isValid = await bcrypt.compare(oldPassword, user.password)

    if (!isValid) {
      throw new Error('Invalid current password')
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })
  }

  // Generate JWT token
  private static generateToken(user: User): string {
    return jwt.sign(
      { 
        userId: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
  }

  // Verify JWT token
  static async verifyToken(token: string): Promise<SafeUser> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
      const user = await this.getUserById(decoded.userId)
      return this.sanitizeUser(user)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  // Remove sensitive information from user object
  private static sanitizeUser(user: User): SafeUser {
    const { password, ...safeUser } = user
    return safeUser
  }

  // Create session
  static async createSession(userId: number): Promise<string> {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    const session = await prisma.session.create({
      data: {
        id: uuidv4(),
        userId,
        expiresAt,
      },
    })

    return session.id
  }

  // Get session
  static async getSession(sessionId: string): Promise<Session | null> {
    return prisma.session.findFirst({
      where: {
        id: sessionId,
        expiresAt: {
          gt: new Date(),
        },
      },
    })
  }

  // Delete session
  static async deleteSession(sessionId: string): Promise<void> {
    await prisma.session.delete({
      where: { id: sessionId },
    })
  }

  // Create password reset token
  static async createPasswordResetToken(userId: number): Promise<string> {
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour from now

    await prisma.passwordResetToken.create({
      data: {
        id: uuidv4(),
        userId,
        token,
        expiresAt,
      },
    })

    return token
  }

  // Create email verification token
  static async createEmailVerificationToken(userId: number): Promise<string> {
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 1) // 24 hours from now

    await prisma.emailVerificationToken.create({
      data: {
        id: uuidv4(),
        userId,
        token,
        expiresAt,
      },
    })

    return token
  }

  // Verify email
  static async verifyEmail(token: string): Promise<void> {
    const verificationToken = await prisma.emailVerificationToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!verificationToken) {
      throw new Error('Invalid or expired token')
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: new Date() },
      }),
      prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      }),
    ])
  }
} 