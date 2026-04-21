"use client";

import {
  FileText,
  CheckCircle,
  Lightbulb,
  Send,
  User,
  Star,
  Clock,
} from "lucide-react";
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
    icon: <FileText className="h-4 w-4 text-blue-500" />,
    title: "Tailor your resume",
    description:
      "Highlight skills that match this role. Use keywords from the job description.",
  },
  {
    icon: <Send className="h-4 w-4 text-emerald-500" />,
    title: "Write a strong cover letter",
    description:
      "Explain why you're excited about this role and how your experience aligns.",
  },
  {
    icon: <CheckCircle className="h-4 w-4 text-purple-500" />,
    title: "Proofread everything",
    description:
      "Double-check for spelling and grammar errors before submitting.",
  },
  {
    icon: <Clock className="h-4 w-4 text-amber-500" />,
    title: "Apply early",
    description:
      "Many recruiters review applications on a rolling basis — don't wait.",
  },
];

const interviewTips: Tip[] = [
  {
    icon: <User className="h-4 w-4 text-sky-500" />,
    title: "Research the company",
    description:
      "Learn about the company's mission, values, and recent news before your interview.",
  },
  {
    icon: <Lightbulb className="h-4 w-4 text-yellow-500" />,
    title: "Prepare examples",
    description:
      "Have specific examples ready that demonstrate your skills and achievements.",
  },
  {
    icon: <Star className="h-4 w-4 text-pink-500" />,
    title: "Prepare questions",
    description:
      "Come with thoughtful questions about the role, team, and company culture.",
  },
];

function TipRow({ tip }: { tip: Tip }) {
  return (
    <div className="flex gap-3 rounded-xl bg-slate-50 px-3 py-3 transition-colors hover:bg-slate-100">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
        {tip.icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900">{tip.title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
          {tip.description}
        </p>
      </div>
    </div>
  );
}

const checklistItems = [
  "Updated resume ready",
  "Cover letter customized",
  "Contact information current",
  "LinkedIn profile complete",
  "Portfolio / projects ready",
  "References available",
];

export function ApplicationTips({
  jobType,
  experience,
}: ApplicationTipsProps) {
  const roleSpecificTips: Tip[] = [];

  if (experience) {
    roleSpecificTips.push({
      icon: <Star className="h-4 w-4 text-indigo-500" />,
      title: `${experience} level preparation`,
      description: `Emphasise relevant project experience and be ready to discuss your career progression.`,
    });
  }

  if (jobType === "INTERNSHIP" || jobType === "PART_TIME") {
    roleSpecificTips.push({
      icon: <Clock className="h-4 w-4 text-teal-500" />,
      title: "Flexible schedule",
      description:
        "Be prepared to discuss your availability and how you'll balance other commitments.",
    });
  }

  if (jobType === "REMOTE") {
    roleSpecificTips.push({
      icon: <User className="h-4 w-4 text-cyan-500" />,
      title: "Remote work setup",
      description:
        "Be ready to discuss your home office, communication preferences, and tools.",
    });
  }

  return (
    <div className="space-y-4">
      {/* Before applying */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-3 pt-5">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <FileText className="h-4 w-4 text-blue-500" />
            Before you apply
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pb-5 pt-0">
          {generalTips.map((tip, i) => (
            <TipRow key={i} tip={tip} />
          ))}
        </CardContent>
      </Card>

      {/* Role-specific tips */}
      {roleSpecificTips.length > 0 && (
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-3 pt-5">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Tips for this role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pb-5 pt-0">
            {roleSpecificTips.map((tip, i) => (
              <TipRow key={i} tip={tip} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Interview prep */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-3 pt-5">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            Interview preparation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pb-5 pt-0">
          {interviewTips.map((tip, i) => (
            <TipRow key={i} tip={tip} />
          ))}
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-3 pt-5">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Application checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-5 pt-0">
          <div className="grid gap-2 sm:grid-cols-2">
            {checklistItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
              >
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {i + 1}
                  </span>
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