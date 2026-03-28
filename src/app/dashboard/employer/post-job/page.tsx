"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, Briefcase, MapPin, DollarSign, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(140deg,_rgba(15,23,42,0.96),_rgba(8,47,73,0.92)_45%,_rgba(6,95,70,0.82))] p-5 text-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.9)] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.18),_transparent_24%)]" />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Publish a role
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-5xl">
              Create a job post that candidates can scan fast.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              Keep the title clear, make the requirements specific, and structure
              the post so stronger candidates can self-qualify quickly.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <Briefcase className="h-5 w-5 text-sky-100" />
              <p className="mt-3 text-lg font-bold">Clear title</p>
              <p className="mt-1 text-sm text-slate-200">Use the actual role name candidates search for.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <MapPin className="h-5 w-5 text-emerald-100" />
              <p className="mt-3 text-lg font-bold">Strong location signal</p>
              <p className="mt-1 text-sm text-slate-200">Remote, hybrid, or city-specific should be obvious.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <DollarSign className="h-5 w-5 text-amber-100" />
              <p className="mt-3 text-lg font-bold">Salary clarity</p>
              <p className="mt-1 text-sm text-slate-200">A clean range usually improves applicant quality.</p>
            </div>
          </div>
        </div>
      </section>

      <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight text-slate-950">Post a new job</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input className="mt-2 h-14" id="title" {...form.register("title")} />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input className="mt-2 h-14" id="location" {...form.register("location")} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <Input
                  className="mt-2 h-14"
                  id="salaryMin"
                  onChange={(event) =>
                    form.setValue("salaryMin", event.target.value ? Number(event.target.value) : undefined)
                  }
                  placeholder="50000"
                  type="number"
                  value={salaryMin ?? ""}
                />
              </div>
              <div>
                <Label htmlFor="salaryMax">Maximum Salary</Label>
                <Input
                  className="mt-2 h-14"
                  id="salaryMax"
                  onChange={(event) =>
                    form.setValue("salaryMax", event.target.value ? Number(event.target.value) : undefined)
                  }
                  placeholder="80000"
                  type="number"
                  value={salaryMax ?? ""}
                />
                {form.formState.errors.salaryMax ? (
                  <p className="mt-1 text-sm text-rose-500">
                    {form.formState.errors.salaryMax.message}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="salaryType">Salary Type</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("salaryType", value as FormData["salaryType"])
                  }
                  value={salaryType}
                >
                  <SelectTrigger className="mt-2 h-14 rounded-2xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Range">Range</SelectItem>
                    <SelectItem value="Negotiable">Negotiable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <Label htmlFor="jobType">Job Type *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("jobType", value as FormData["jobType"])
                  }
                  value={jobType}
                >
                  <SelectTrigger className="mt-2 h-14 rounded-2xl">
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
              <div>
                <Label htmlFor="experience">Experience *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("experience", value as FormData["experience"])
                  }
                  value={experience}
                >
                  <SelectTrigger className="mt-2 h-14 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTRY">Entry Level</SelectItem>
                    <SelectItem value="MID">Mid Level</SelectItem>
                    <SelectItem value="SENIOR">Senior Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="categoryId">Category *</Label>
                <Select onValueChange={(value) => form.setValue("categoryId", value)} value={categoryId}>
                  <SelectTrigger className="mt-2 h-14 rounded-2xl">
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
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                className="mt-2 resize-y"
                id="description"
                rows={7}
                {...form.register("description")}
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements *</Label>
              <Textarea
                className="mt-2 resize-y"
                id="requirements"
                rows={5}
                {...form.register("requirements")}
              />
            </div>

            <Button className="h-16 w-full text-lg font-bold" disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Posting job...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Post Job Now
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
