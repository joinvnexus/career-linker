import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const categories = [
    { name: 'Software Development', slug: 'software-development' },
    { name: 'Marketing', slug: 'marketing' },
    { name: 'Sales', slug: 'sales' },
    { name: 'Design', slug: 'design' },
    { name: 'Finance', slug: 'finance' },
    { name: 'HR', slug: 'hr' },
    { name: 'Operations', slug: 'operations' },
    { name: 'Customer Support', slug: 'customer-support' },
    { name: 'Data Science', slug: 'data-science' },
    { name: 'General', slug: 'general' },
  ];

  for (const cat of categories) {
    await prisma.jobCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Test Employer
  const employerPassword = await hash('password123', 12);
  const employer = await prisma.user.upsert({
    where: { email: 'employer@test.com' },
    update: {},
    create: {
      email: 'employer@test.com',
      name: 'Test Employer',
      hashedPassword: employerPassword,
      role: 'EMPLOYER',
      employerProfile: {
        create: {
          companyName: 'Test Corp',
          location: 'Dhaka',
          industry: 'Tech',
        },
      },
    },
  });

  // Test Job Seeker
  const seekerPassword = await hash('password123', 12);
  await prisma.user.upsert({
    where: { email: 'seeker@test.com' },
    update: {},
    create: {
      email: 'seeker@test.com',
      name: 'Test Seeker',
      hashedPassword: seekerPassword,
      role: 'JOB_SEEKER',
      jobSeekerProfile: {
        create: {
          headline: 'Junior Developer',
          location: 'Dhaka',
        },
      },
    },
  });

  // Test Job
  await prisma.job.create({
    data: {
      title: 'Junior React Developer',
      slug: 'junior-react-developer-test',
      description: 'Join our team as a Junior React Developer...',
      requirements: 'React, TypeScript, Tailwind CSS',
      location: 'Dhaka, Remote OK',
      jobType: 'FULL_TIME',
      experience: 'ENTRY',
      salaryMin: 50000,
      salaryMax: 80000,
      salaryType: 'Fixed',
      employerId: employer.id,
      category: { connect: { slug: 'software-development' } },
      status: 'ACTIVE',
      published: true,
      paymentStatus: 'PAID',
    },
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

