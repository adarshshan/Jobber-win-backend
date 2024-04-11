import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shanuadarsh143@gmail.com',
        pass: 'lpgf tiio bycp znjf',
    }
})

export const generateAndSendOTP = async (toEmail: string): Promise<string> => {
    const otp: string | null = generateRandomOTP()

    const mailOptions = {
        from: 'shanuadarsh143@gmail.com',
        to: toEmail,
        subject: 'OTP Verification',
        text: `Welcome to JobberWin. Your OTP for registration is: ${otp}`
    }
    await transporter.sendMail(mailOptions)
    return otp
}

function generateRandomOTP(): string {
    const otpLength = 6
    const min = Math.pow(10, otpLength - 1)
    const max = Math.pow(10, otpLength) - 1
    const randomOTP = Math.floor(min + Math.random() * (max - min + 1))
    return randomOTP.toString()
}