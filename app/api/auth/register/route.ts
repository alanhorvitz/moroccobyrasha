import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { registerSchema } from '@/types/user'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await AuthService.getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Register user
    const user = await AuthService.register(validatedData)

    // Create session
    const sessionId = await AuthService.createSession(user.id)

    // Return user data and session
    return NextResponse.json(
      {
        user,
        sessionId,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 