import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {

  const info = await transporter.sendMail({
    from: `"InternStatus" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("📧 Email sent:", info.messageId);
};

export default sendEmail;