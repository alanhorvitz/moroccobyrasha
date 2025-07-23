import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateVerificationEmail, sendEmail } from '@/lib/email'
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

    if (!user || user.emailVerified) {
      // Return success even if user doesn't exist or is already verified
      return NextResponse.json({ success: true })
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
      },
    })

    // Send verification email
    const { subject, html } = generateVerificationEmail(user.email, verificationToken)
    await sendEmail({
      to: user.email,
      subject,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 