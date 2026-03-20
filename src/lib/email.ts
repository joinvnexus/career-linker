import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
  })
}

export async function sendApplicationReceivedEmail(jobTitle: string, applicantName: string, employerEmail: string) {
  await sendEmail(
    employerEmail,
    `New Application for ${jobTitle}`,
    `<p>New application from ${applicantName}</p>`
  )
}

