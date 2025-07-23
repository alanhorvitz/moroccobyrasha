import { z } from 'zod'

// Base user schema with common fields
const userBaseSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phoneNumber: z.string().optional(),
  language: z.enum(['en', 'ar']).default('en'),
})

// Registration schema with additional fields
export const registerSchema = userBaseSchema.extend({
  confirmPassword: z.string(),
  // Add more registration fields here
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  interests: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

// User type for the database
export type User = {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  language: 'en' | 'ar'
  dateOfBirth?: string
  nationality?: string
  address?: string
  city?: string
  country?: string
  interests?: string[]
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

// Session type
export type Session = {
  id: string
  userId: number
  expiresAt: Date
}

// Safe user type (without sensitive information)
export type SafeUser = Omit<User, 'password'> 