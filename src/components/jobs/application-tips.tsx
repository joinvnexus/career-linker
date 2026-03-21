"use client";

import { FileText, CheckCircle, Lightbulb, Send, User, Star, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApplicationTipsProps {
  jobTitle: string;
  requirements?: string;
  jobType?: string;
  experience?: string;
}

interface Tip {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const generalTips: Tip[] = [
  {
    icon: <FileText className="h-5 w-5 text-blue-500" />,
    title: "Tailor Your Resume",
    description: "Customize your resume to highlight skills and experience matching this role. Use keywords from the job description.",
  },
  {
    icon: <Send className="h-5 w-5 text-emerald-500" />,
    title: "Write a Strong Cover Letter",
    description: "Explain why you're excited about this specific role and how your experience aligns with the job requirements.",
  },
  {
    icon: <CheckCircle className="h-5 w-5 text-purple-500" />,
    title: "Proofread Everything",
    description: "Double-check your application for spelling and grammar errors. First impressions matter!",
  },
  {
    icon: <Clock className="h-5 w-5 text-amber-500" />,
    title: "Apply Early",
    description: "Submit your application as soon as possible. Many recruiters review applications on a rolling basis.",
  },
];

const interviewTips: Tip[] = [
  {
    icon: <User className="h-5 w-5 text-sky-500" />,
    title: "Research the Company",
    description: "Learn about the company's mission, values, recent news, and culture before your interview.",
  },
  {
    icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
    title: "Prepare Examples",
    description: "Have specific examples ready that demonstrate your skills and achievements relevant to this role.",
  },
  {
    icon: <Star className="h-5 w-5 text-pink-500" />,
    title: "Prepare Questions",
    description: "Come ready with thoughtful questions about the role, team, and company to show your interest.",
  },
];

function TipCard({ tip }: { tip: Tip }) {
  return (
    <div className="flex gap-4 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
        {tip.icon}
      </div>
      <div>
        <h4 className="font-semibold text-slate-900">{tip.title}</h4>
        <p className="mt-1 text-sm text-slate-600">{tip.description}</p>
      </div>
    </div>
  );
}

export function ApplicationTips({
  jobTitle,
  requirements,
  jobType,
  experience,
}: ApplicationTipsProps) {
  // Generate role-specific tips based on job details
  const getRoleSpecificTips = (): Tip[] => {
    const tips: Tip[] = [];
    
    if (experience) {
      tips.push({
        icon: <Star className="h-5 w-5 text-indigo-500" />,
        title: `${experience} Level Preparation`,
        description: `As a ${experience} position, emphasize relevant project experience and be ready to discuss your career progression.`,
      });
    }

    if (jobType === "INTERNSHIP" || jobType === "PART_TIME") {
      tips.push({
        icon: <Clock className="h-5 w-5 text-teal-500" />,
        title: "Flexible Schedule Ready",
        description: "Be prepared to discuss your availability and how you'll balance this role with other commitments.",
      });
    }

    if (jobType === "REMOTE") {
      tips.push({
        icon: <User className="h-5 w-5 text-cyan-500" />,
        title: "Remote Work Setup",
        description: "Be ready to discuss your home office setup, communication preferences, and tools you're proficient with.",
      });
    }

    return tips;
  };

  const roleSpecificTips = getRoleSpecificTips();

  return (
    <div className="space-y-8">
      {/* Before Applying */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-blue-500" />
            Before You Apply
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {generalTips.map((tip, index) => (
            <TipCard key={index} tip={tip} />
          ))}
        </CardContent>
      </Card>

      {/* Role-Specific Tips */}
      {roleSpecificTips.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Tips for This Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roleSpecificTips.map((tip, index) => (
              <TipCard key={index} tip={tip} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Interview Preparation */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            Interview Preparation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {interviewTips.map((tip, index) => (
            <TipCard key={index} tip={tip} />
          ))}
        </CardContent>
      </Card>

      {/* Application Checklist */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Application Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Updated resume ready",
              "Cover letter customized",
              "Contact information current",
              "LinkedIn profile complete",
              "Portfolio/projects ready",
              "References available",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
                  <span className="text-xs font-medium text-slate-500">{index + 1}</span>
                </div>
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
