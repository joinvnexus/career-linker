export const siteConfig = {
  name: "Career-Linker",
  title: "Career-Linker | Job Search and Hiring Platform",
  description:
    "Career-Linker connects job seekers, employers, and administrators in a single job marketplace.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "en_US",
} as const;

export type SiteConfig = typeof siteConfig;
