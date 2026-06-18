import nodemailer from 'nodemailer';
import EmailLog from '../models/EmailLog';
import NotificationPreference from '../models/NotificationPreference';
import mongoose from 'mongoose';

// Configure Transporter
// If SMTP is not provided, use Ethereal (mock email service) or just console.log
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // For local dev without SMTP
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

export const sendEmail = async (
  userId: string | mongoose.Types.ObjectId,
  to: string,
  subject: string,
  html: string,
  type: string
) => {
  try {
    // Check Preferences
    const prefs = await NotificationPreference.findOne({ userId });
    if (prefs && !prefs.emailNotifications) {
      // User opted out of emails
      // Exception: Password Reset should always send
      if (type !== 'PASSWORD_RESET' && type !== 'EMAIL_VERIFICATION') {
        return false;
      }
    }

    const transporter = await createTransporter();
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"DevBattle" <noreply@devbattle.app>',
      to,
      subject,
      html,
    });

    console.log(`Email sent: ${info.messageId}`);
    if (info.messageId && !process.env.SMTP_HOST) {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    // Log the success
    await EmailLog.create({
      to,
      subject,
      status: 'SENT',
      type,
    });

    return true;
  } catch (error: any) {
    console.error('Email sending failed:', error);
    
    // Log the failure
    await EmailLog.create({
      to,
      subject,
      status: 'FAILED',
      error: error.message,
      type,
    });

    return false;
  }
};
