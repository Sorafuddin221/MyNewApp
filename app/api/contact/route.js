import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/sendEmail';

export async function POST(req) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ message: "Please fill in all fields" }, { status: 400 });
        }

        const subject = `Contact Form Submission from ${name}`;
        const emailMessage = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

        await sendEmail({
            email: process.env.SMTP_MAIL, // Send to the configured SMTP user
            subject,
            message: emailMessage,
        });

        return NextResponse.json({
            success: true,
            message: "Your message has been sent successfully!",
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
    }
}