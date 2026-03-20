import nodemailer from "nodemailer";
import { env } from "@/lib/env";

const emailEnabled =
  Boolean(env.EMAIL_SERVER_HOST) &&
  Boolean(env.EMAIL_SERVER_PORT) &&
  Boolean(env.EMAIL_SERVER_USER) &&
  Boolean(env.EMAIL_SERVER_PASSWORD) &&
  Boolean(env.EMAIL_FROM);

const transporter = emailEnabled
  ? nodemailer.createTransport({
      host: env.EMAIL_SERVER_HOST,
      port: Number(env.EMAIL_SERVER_PORT || "587"),
      secure: Number(env.EMAIL_SERVER_PORT || "587") === 465,
      auth: {
        user: env.EMAIL_SERVER_USER,
        pass: env.EMAIL_SERVER_PASSWORD,
      },
    })
  : null;

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  if (!transporter || !env.EMAIL_FROM) {
    return false;
  }

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  return true;
};

export const sendApplicationReceivedEmail = async ({
  applicantName,
  employerEmail,
  jobTitle,
}: {
  applicantName: string;
  employerEmail: string;
  jobTitle: string;
}): Promise<boolean> =>
  sendEmail(
    employerEmail,
    `New application for ${jobTitle}`,
    `<p>${applicantName} applied for <strong>${jobTitle}</strong>.</p>`
  );

export const sendApplicationStatusEmail = async ({
  applicantEmail,
  applicantName,
  jobTitle,
  status,
}: {
  applicantEmail: string;
  applicantName: string;
  jobTitle: string;
  status: string;
}): Promise<boolean> =>
  sendEmail(
    applicantEmail,
    `Application update for ${jobTitle}`,
    `<p>Hello ${applicantName}, your application for <strong>${jobTitle}</strong> is now <strong>${status.replaceAll("_", " ")}</strong>.</p>`
  );
