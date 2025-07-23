import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { loginSchema } from '@/types/user'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = loginSchema.parse(body)

    // Login user
    const { user, token } = await AuthService.login(
      validatedData.email,
      validatedData.password
    )

    // Create session
    const sessionId = await AuthService.createSession(user.id)

    // Return user data, token and session
    return NextResponse.json({
      user,
      token,
      sessionId,
    })
  } catch (error: any) {
    console.error('Login error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    if (error.message === 'User not found' || error.message === 'Invalid password') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 