import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface Attachment {
  filename: string;
  content: Buffer;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    const message = formData.get('message') as string;
    const resume = formData.get('resume') as File | null;

    // Validate the input
    if (!name || !email || !role || !message) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Convert resume to base64 if present
    const attachments: Attachment[] = [];
    if (resume) {
      const buffer = Buffer.from(await resume.arrayBuffer());
      attachments.push({
        filename: resume.name,
        content: buffer,
      });
    }

    // Email to careers
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'careers@promptsforeveryone.com',
      subject: `Career Interest: ${role} - ${name}`,
      html: `
        <h2>New Career Interest Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Interested Role:</strong> ${role}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      attachments,
    });

    // Auto-reply to the candidate
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Thank you for your interest in PromptsForEveryone',
      html: `
        <h2>Thank you for your interest!</h2>
        <p>Dear ${name},</p>
        <p>We have received your application for the ${role} role. Our team will review your information and get back to you if there's a potential match.</p>
        <p>Best regards,<br>The PromptsForEveryone Team</p>
      `,
    });

    return NextResponse.json(
      { message: 'Application submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Career form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
} 