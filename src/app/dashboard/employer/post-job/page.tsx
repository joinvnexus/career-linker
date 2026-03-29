"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, Briefcase, MapPin, DollarSign, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const schema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(50, "Description too short"),
    requirements: z.string().min(20, "Requirements too short"),
    salaryMin: z.number().optional(),
    salaryMax: z.number().optional(),
    salaryType: z.enum(["Fixed", "Range", "Negotiable"]).optional(),
    location: z.string().min(2, "Location required"),
    jobType: z.enum(["FULL_TIME", "PART_TIME", "REMOTE", "CONTRACT", "INTERNSHIP"]),
    experience: z.enum(["ENTRY", "MID", "SENIOR"]),
    categoryId: z.string().min(1, "Category is required"),
  })
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMin <= data.salaryMax,
    {
      message: "Minimum salary cannot exceed maximum salary",
      path: ["salaryMax"],
    }
  );

type FormData = z.infer<typeof schema>;
type Category = { id: string; name: string };

export default function PostJobPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<Category[]>([]);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      location: "",
      jobType: "FULL_TIME",
      experience: "ENTRY",
      categoryId: "",
      salaryType: "Range",
    },
  });
  const salaryType = useWatch({ control: form.control, name: "salaryType" });
  const salaryMin = useWatch({ control: form.control, name: "salaryMin" });
  const salaryMax = useWatch({ control: form.control, name: "salaryMax" });
  const jobType = useWatch({ control: form.control, name: "jobType" });
  const experience = useWatch({ control: form.control, name: "experience" });
  const categoryId = useWatch({ control: form.control, name: "categoryId" });

  useEffect(() => {
    const loadCategories = async (): Promise<void> => {
      try {
        const response = await fetch("/api/categories");
        const data = (await response.json()) as { categories?: Category[] };
        const items = data.categories ?? [];
        setCategories(items);
        if (items[0] && !form.getValues("categoryId")) {
          form.setValue("categoryId", items[0].id);
        }
      } catch {
        toast.error("Failed to load categories");
      }
    };

    void loadCategories();
  }, [form]);

  const onSubmit = (data: FormData): void => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const payload = (await response.json()) as {
          error?: string;
          job?: { id: string };
          paymentRequired?: boolean;
        };

        if (!response.ok || !payload.job) {
          toast.error(payload.error || "Failed to post job");
          return;
        }

        if (payload.paymentRequired) {
          const checkoutResponse = await fetch("/api/billing/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId: payload.job.id }),
          });
          const checkoutData = (await checkoutResponse.json()) as {
            error?: string;
            url?: string;
          };

          if (!checkoutResponse.ok || !checkoutData.url) {
            toast.error(checkoutData.error || "Failed to start payment");
            return;
          }

          window.location.href = checkoutData.url;
          return;
        }

        toast.success("Job posted successfully");
        router.push("/dashboard/employer/jobs");
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="surface-inverse relative overflow-hidden rounded-[2rem] border border-white/10 p-5 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.18),_transparent_24%)]" />
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)]">
          <div className="max-w-2xl">
            <div className="eyebrow border-white/10 bg-white/10 text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Publish a role
            </div>
            <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] text-white lg:text-5xl">
              Create a job post that candidates can scan fast.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              Keep the title clear, make the requirements specific, and structure the post so stronger candidates can self-qualify quickly.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur sm:p-5">
              <Briefcase className="h-5 w-5 text-sky-100" />
              <p className="mt-3 text-lg font-semibold">Clear title</p>
              <p className="mt-1 text-sm text-slate-200">Use the actual role name candidates search for.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur sm:p-5">
              <MapPin className="h-5 w-5 text-emerald-100" />
              <p className="mt-3 text-lg font-semibold">Strong location signal</p>
              <p className="mt-1 text-sm text-slate-200">Remote, hybrid, or city-specific should be obvious.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur sm:p-5">
              <DollarSign className="h-5 w-5 text-amber-100" />
              <p className="mt-3 text-lg font-semibold">Salary clarity</p>
              <p className="mt-1 text-sm text-slate-200">A clean range usually improves applicant quality.</p>
            </div>
          </div>
        </div>
      </section>

      <form className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_320px]" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-white/80 bg-white/94">
          <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input className="h-14" id="title" {...form.register("title")} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="location">Location *</Label>
                <Input className="h-14" id="location" {...form.register("location")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <Input
                  className="h-14"
                  id="salaryMin"
                  onChange={(event) =>
                    form.setValue("salaryMin", event.target.value ? Number(event.target.value) : undefined)
                  }
                  placeholder="50000"
                  type="number"
                  value={salaryMin ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary</Label>
                <Input
                  className="h-14"
                  id="salaryMax"
                  onChange={(event) =>
                    form.setValue("salaryMax", event.target.value ? Number(event.target.value) : undefined)
                  }
                  placeholder="80000"
                  type="number"
                  value={salaryMax ?? ""}
                />
                {form.formState.errors.salaryMax ? (
                  <p className="mt-1 text-sm text-rose-500">{form.formState.errors.salaryMax.message}</p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="salaryType">Salary Type</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("salaryType", value as FormData["salaryType"])
                  }
                  value={salaryType}
                >
                  <SelectTrigger className="h-14 rounded-[1rem]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Range">Range</SelectItem>
                    <SelectItem value="Negotiable">Negotiable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("jobType", value as FormData["jobType"])
                  }
                  value={jobType}
                >
                  <SelectTrigger className="h-14 rounded-[1rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("experience", value as FormData["experience"])
                  }
                  value={experience}
                >
                  <SelectTrigger className="h-14 rounded-[1rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTRY">Entry Level</SelectItem>
                    <SelectItem value="MID">Mid Level</SelectItem>
                    <SelectItem value="SENIOR">Senior Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select onValueChange={(value) => form.setValue("categoryId", value)} value={categoryId}>
                  <SelectTrigger className="h-14 rounded-[1rem]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea className="resize-y" id="description" rows={7} {...form.register("description")} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="requirements">Requirements *</Label>
                <Textarea className="resize-y" id="requirements" rows={5} {...form.register("requirements")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/80 bg-white/94">
            <CardContent className="p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Posting checklist</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-[1rem] bg-slate-50/80 p-3">Use the real title candidates search for, not internal naming.</div>
                <div className="rounded-[1rem] bg-slate-50/80 p-3">Keep location and salary transparent for better applicant quality.</div>
                <div className="rounded-[1rem] bg-slate-50/80 p-3">Make responsibilities clear enough that candidates can self-qualify.</div>
              </div>
            </CardContent>
          </Card>

          <Button className="h-14 w-full text-base font-semibold" disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Posting job...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Post Job Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
