import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generatePasswordResetEmail, sendEmail } from '@/lib/email'
import crypto from 'crypto'

const schema = z.object({
  email: z.string().email(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = schema.parse(json)

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json({ success: true })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Send reset email
    const { subject, html } = generatePasswordResetEmail(user.email, resetToken)
    await sendEmail({
      to: user.email,
      subject,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 