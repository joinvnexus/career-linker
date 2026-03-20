import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the seed script.");
}

const pool = new Pool({
  connectionString,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const main = async (): Promise<void> => {
  const categories = [
    { name: "Software Development", slug: "software-development" },
    { name: "Marketing", slug: "marketing" },
    { name: "Sales", slug: "sales" },
    { name: "Design", slug: "design" },
    { name: "Finance", slug: "finance" },
    { name: "HR", slug: "hr" },
    { name: "Operations", slug: "operations" },
    { name: "Customer Support", slug: "customer-support" },
    { name: "Data Science", slug: "data-science" },
    { name: "General", slug: "general" },
  ];

  for (const category of categories) {
    await prisma.jobCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const employerPassword = await hash("password123", 12);
  const employer = await prisma.user.upsert({
    where: { email: "employer@test.com" },
    update: {},
    create: {
      email: "employer@test.com",
      name: "Test Employer",
      hashedPassword: employerPassword,
      role: "EMPLOYER",
      employerProfile: {
        create: {
          companyName: "Test Corp",
          location: "Dhaka",
          industry: "Tech",
        },
      },
    },
  });

  const seekerPassword = await hash("password123", 12);
  await prisma.user.upsert({
    where: { email: "seeker@test.com" },
    update: {},
    create: {
      email: "seeker@test.com",
      name: "Test Seeker",
      hashedPassword: seekerPassword,
      role: "JOB_SEEKER",
      jobSeekerProfile: {
        create: {
          headline: "Junior Developer",
          location: "Dhaka",
        },
      },
    },
  });

  const softwareCategory = await prisma.jobCategory.findUniqueOrThrow({
    where: { slug: "software-development" },
  });

  await prisma.job.upsert({
    where: {
      slug: "junior-react-developer-test",
    },
    update: {
      title: "Junior React Developer",
      description: "Join our team as a Junior React Developer...",
      requirements: "React, TypeScript, Tailwind CSS",
      location: "Dhaka, Remote OK",
      jobType: "FULL_TIME",
      experience: "ENTRY",
      salaryMin: 50000,
      salaryMax: 80000,
      salaryType: "Fixed",
      employerId: employer.id,
      categoryId: softwareCategory.id,
      status: "ACTIVE",
      published: true,
      paymentStatus: "PAID",
    },
    create: {
      title: "Junior React Developer",
      slug: "junior-react-developer-test",
      description: "Join our team as a Junior React Developer...",
      requirements: "React, TypeScript, Tailwind CSS",
      location: "Dhaka, Remote OK",
      jobType: "FULL_TIME",
      experience: "ENTRY",
      salaryMin: 50000,
      salaryMax: 80000,
      salaryType: "Fixed",
      employerId: employer.id,
      categoryId: softwareCategory.id,
      status: "ACTIVE",
      published: true,
      paymentStatus: "PAID",
    },
  });

  console.log("Seeding complete.");
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
