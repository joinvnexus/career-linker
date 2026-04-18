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

  const companies = [
    { companyName: "Tech Solutions Ltd", location: "Dhaka", industry: "Technology", size: "50-200" },
    { companyName: "Creative Studios", location: "Chittagong", industry: "Design", size: "20-50" },
    { companyName: "Finance Hub", location: "Dhaka", industry: "Finance", size: "200-500" },
    { companyName: "Digital Marketing Pro", location: "Sylhet", industry: "Marketing", size: "10-20" },
    { companyName: "HealthTech Bangladesh", location: "Dhaka", industry: "Healthcare", size: "50-100" },
    { companyName: "E-Commerce Global", location: "Dhaka", industry: "E-commerce", size: "100-500" },
    { companyName: "EduTech Institute", location: "Rajshahi", industry: "Education", size: "20-50" },
    { companyName: "Green Energy Corp", location: "Khulna", industry: "Energy", size: "50-100" },
    { companyName: "LogiTrans Ltd", location: "Dhaka", industry: "Logistics", size: "100-200" },
    { companyName: "Foodie Delivery", location: "Dhaka", industry: "Food & Beverage", size: "50-100" },
    { companyName: "CloudServe Inc", location: "Remote", industry: "Technology", size: "20-50" },
    { companyName: "Retail Partners", location: "Chittagong", industry: "Retail", size: "200-500" },
    { companyName: "Media Waves", location: "Dhaka", industry: "Media", size: "20-50" },
    { companyName: "Construction Experts", location: "Dhaka", industry: "Construction", size: "50-100" },
    { companyName: "AgriSmart Bangladesh", location: "Barisal", industry: "Agriculture", size: "10-20" },
  ];

  const employers = [];
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    const password = await hash("password123", 12);
    const email = `employer${i + 1}@test.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: company.companyName,
        hashedPassword: password,
        role: "EMPLOYER",
        employerProfile: {
          create: {
            companyName: company.companyName,
            location: company.location,
            industry: company.industry,
            companySize: company.size,
          },
        },
      },
    });
    employers.push(user);
  }

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

  const jobs = [
    { title: "Senior React Developer", slug: "senior-react-developer", category: "software-development", salaryMin: 80000, salaryMax: 120000, jobType: "FULL_TIME", experience: "SENIOR", location: "Dhaka" },
    { title: "Junior Node.js Developer", slug: "junior-nodejs-developer", category: "software-development", salaryMin: 40000, salaryMax: 60000, jobType: "FULL_TIME", experience: "ENTRY", location: "Remote" },
    { title: "Digital Marketing Manager", slug: "digital-marketing-manager", category: "marketing", salaryMin: 50000, salaryMax: 80000, jobType: "FULL_TIME", experience: "MID", location: "Dhaka" },
    { title: "UX/UI Designer", slug: "ux-ui-designer", category: "design", salaryMin: 45000, salaryMax: 70000, jobType: "FULL_TIME", experience: "MID", location: "Chittagong" },
    { title: "Financial Analyst", slug: "financial-analyst", category: "finance", salaryMin: 55000, salaryMax: 90000, jobType: "FULL_TIME", experience: "MID", location: "Dhaka" },
    { title: "HR Coordinator", slug: "hr-coordinator", category: "hr", salaryMin: 35000, salaryMax: 50000, jobType: "FULL_TIME", experience: "ENTRY", location: "Dhaka" },
    { title: "Operations Manager", slug: "operations-manager", category: "operations", salaryMin: 60000, salaryMax: 100000, jobType: "FULL_TIME", experience: "SENIOR", location: "Dhaka" },
    { title: "Customer Support Executive", slug: "customer-support-executive", category: "customer-support", salaryMin: 25000, salaryMax: 40000, jobType: "FULL_TIME", experience: "ENTRY", location: "Dhaka" },
    { title: "Data Scientist", slug: "data-scientist", category: "data-science", salaryMin: 70000, salaryMax: 130000, jobType: "FULL_TIME", experience: "MID", location: "Remote" },
    { title: "Sales Executive", slug: "sales-executive", category: "sales", salaryMin: 30000, salaryMax: 60000, jobType: "FULL_TIME", experience: "ENTRY", location: "Chittagong" },
    { title: "Python Django Developer", slug: "python-django-developer", category: "software-development", salaryMin: 60000, salaryMax: 100000, jobType: "FULL_TIME", experience: "MID", location: "Dhaka" },
    { title: "Content Writer", slug: "content-writer", category: "marketing", salaryMin: 25000, salaryMax: 45000, jobType: "PART_TIME", experience: "ENTRY", location: "Remote" },
    { title: "Graphic Designer", slug: "graphic-designer", category: "design", salaryMin: 30000, salaryMax: 50000, jobType: "FULL_TIME", experience: "ENTRY", location: "Sylhet" },
    { title: "Business Analyst", slug: "business-analyst", category: "finance", salaryMin: 55000, salaryMax: 85000, jobType: "FULL_TIME", experience: "MID", location: "Dhaka" },
    { title: "DevOps Engineer", slug: "devops-engineer", category: "software-development", salaryMin: 80000, salaryMax: 140000, jobType: "FULL_TIME", experience: "SENIOR", location: "Remote" },
  ];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const employerIndex = i % employers.length;
    const categoryData = await prisma.jobCategory.findUniqueOrThrow({
      where: { slug: job.category },
    });

    await prisma.job.upsert({
      where: { slug: job.slug },
      update: {},
      create: {
        title: job.title,
        slug: job.slug,
        description: `We are looking for a ${job.title} to join our team. This is a great opportunity to work with experienced professionals and grow your career.`,
        requirements: `• ${job.experience} level experience\n• Strong communication skills\n• Problem-solving abilities\n• Teamwork and collaboration`,
        responsibilities: `• Work with cross-functional teams\n• Contribute to project success\n• Follow best practices\n• Communicate effectively`,
        location: job.location,
        jobType: job.jobType as "FULL_TIME" | "PART_TIME" | "REMOTE" | "CONTRACT" | "INTERNSHIP",
        experience: job.experience,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryType: "Range",
        employerId: employers[employerIndex].id,
        categoryId: categoryData.id,
        status: "ACTIVE",
        published: true,
        paymentStatus: "PAID",
      },
    });
  }

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
