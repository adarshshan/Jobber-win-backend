import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.TRANSPORTER_EMAIL,
    pass: process.env.TRANSPORTER_PASS,
  },
});

export const generateAndSendOTP = async (
  toEmail: string
): Promise<string | void> => {
  try {
    const otp: string | null = generateRandomOTP();
    const mailOptions = {
      from: process.env.TRANSPORTER_EMAIL,
      to: toEmail,
      subject: "OTP Verification",
      text: `Welcome to JobberWin. Your OTP for registration is: ${otp}`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return otp;
  } catch (error) {
    console.log(error as Error);
  }
};

function generateRandomOTP(): string {
  const otpLength = 6;
  const min = Math.pow(10, otpLength - 1);
  const max = Math.pow(10, otpLength) - 1;
  const randomOTP = Math.floor(min + Math.random() * (max - min + 1));
  return randomOTP.toString();
}
