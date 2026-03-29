"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Sparkles,
  Building2,
  Globe2,
  ImageIcon,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const optionalString = (schema: z.ZodString) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional());

const schema = z.object({
  companyName: optionalString(z.string().min(2).max(120)),
  companyWebsite: optionalString(z.string().url()),
  companySize: optionalString(z.string().min(1).max(50)),
  industry: optionalString(z.string().min(2).max(80)),
  location: optionalString(z.string().min(2).max(120)),
  companyLogo: optionalString(z.string().url()),
});

type FormInput = z.input<typeof schema>;

export default function EmployerProfilePage() {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  const form = useForm<FormInput>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      companyName: "",
      companyWebsite: "",
      companySize: "",
      industry: "",
      location: "",
      companyLogo: "",
    },
  });

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const res = await fetch("/api/profile/employer");
        const data = (await res.json()) as { profile?: Partial<FormInput> };
        if (data.profile) {
          form.reset({
            companyName: data.profile.companyName || "",
            companyWebsite: data.profile.companyWebsite || "",
            companySize: data.profile.companySize || "",
            industry: data.profile.industry || "",
            location: data.profile.location || "",
            companyLogo: data.profile.companyLogo || "",
          });
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [form]);

  const onSubmit = (values: FormInput): void => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/profile/employer", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          const error = (await res.json()) as { error?: string };
          toast.error(error.error || "Failed to update profile");
          return;
        }
        toast.success("Profile updated");
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-[2rem]" />
        <Skeleton className="h-96 rounded-[2rem]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="surface-inverse relative overflow-hidden rounded-[2rem] border border-white/10 p-5 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.18),_transparent_24%)]" />
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)]">
          <div className="max-w-2xl">
            <div className="eyebrow border-white/10 bg-white/10 text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Company profile
            </div>
            <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] text-white lg:text-5xl">
              Shape how candidates understand your company.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              A clearer profile helps candidates trust the role, understand your brand faster, and decide with more confidence.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur sm:p-5">
              <Building2 className="h-5 w-5 text-sky-100" />
              <p className="mt-3 text-lg font-semibold">Brand clarity</p>
              <p className="mt-1 text-sm text-slate-200">Keep name, industry, and size easy to scan.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur sm:p-5">
              <Globe2 className="h-5 w-5 text-emerald-100" />
              <p className="mt-3 text-lg font-semibold">Trust signals</p>
              <p className="mt-1 text-sm text-slate-200">Website and location build confidence quickly.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur sm:p-5">
              <ImageIcon className="h-5 w-5 text-amber-100" />
              <p className="mt-3 text-lg font-semibold">Visual identity</p>
              <p className="mt-1 text-sm text-slate-200">A logo URL makes listings look more complete.</p>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_320px]">
        <Card className="border-white/80 bg-white/94">
          <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Company Name</Label>
                <Input className="h-14" {...form.register("companyName")} />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input className="h-14" {...form.register("companyWebsite")} />
              </div>
              <div className="space-y-2">
                <Label>Company Size</Label>
                <Input className="h-14" {...form.register("companySize")} />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input className="h-14" {...form.register("industry")} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input className="h-14" {...form.register("location")} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Company Logo URL</Label>
                <Input className="h-14" {...form.register("companyLogo")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/80 bg-white/94">
            <CardContent className="p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Profile checklist</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-[1rem] bg-slate-50/80 p-3">Keep the company name identical to your public brand.</div>
                <div className="rounded-[1rem] bg-slate-50/80 p-3">Use a working website and accurate location for trust.</div>
                <div className="rounded-[1rem] bg-slate-50/80 p-3">A clean logo makes listings feel more complete on mobile.</div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full h-14" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save Changes
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
