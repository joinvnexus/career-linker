"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Sparkles,
  Building2,
  Globe2,
  MapPin,
  ImageIcon,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(140deg,_rgba(15,23,42,0.96),_rgba(8,47,73,0.92)_45%,_rgba(6,95,70,0.82))] p-5 text-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.9)] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.18),_transparent_24%)]" />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Company profile
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-5xl">
              Shape how candidates understand your company.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              A clearer profile helps candidates trust the role, understand your
              brand faster, and decide with more confidence.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <Building2 className="h-5 w-5 text-sky-100" />
              <p className="mt-3 text-lg font-bold">Brand clarity</p>
              <p className="mt-1 text-sm text-slate-200">Keep name, industry, and company size easy to scan.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <Globe2 className="h-5 w-5 text-emerald-100" />
              <p className="mt-3 text-lg font-bold">Trust signals</p>
              <p className="mt-1 text-sm text-slate-200">Website and location build confidence quickly.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <ImageIcon className="h-5 w-5 text-amber-100" />
              <p className="mt-3 text-lg font-bold">Visual identity</p>
              <p className="mt-1 text-sm text-slate-200">A logo URL makes listings look more complete.</p>
            </div>
          </div>
        </div>
      </section>

      <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight text-slate-950">Company profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>Company Name</Label>
              <Input className="mt-2 h-12" {...form.register("companyName")} />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>Website</Label>
                <Input className="mt-2 h-12" {...form.register("companyWebsite")} />
              </div>
              <div>
                <Label>Company Size</Label>
                <Input className="mt-2 h-12" {...form.register("companySize")} />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label>Industry</Label>
                <Input className="mt-2 h-12" {...form.register("industry")} />
              </div>
              <div>
                <Label>Location</Label>
                <Input className="mt-2 h-12" {...form.register("location")} />
              </div>
            </div>
            <div>
              <Label>Company Logo URL</Label>
              <Input className="mt-2 h-12" {...form.register("companyLogo")} />
            </div>
            <Button
              type="submit"
              className="bg-slate-950 text-white hover:bg-slate-800"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
