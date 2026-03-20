"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-400">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Company Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Company Name</Label>
            <Input className="mt-1 h-12" {...form.register("companyName")} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Website</Label>
              <Input className="mt-1 h-12" {...form.register("companyWebsite")} />
            </div>
            <div>
              <Label>Company Size</Label>
              <Input className="mt-1 h-12" {...form.register("companySize")} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Industry</Label>
              <Input className="mt-1 h-12" {...form.register("industry")} />
            </div>
            <div>
              <Label>Location</Label>
              <Input className="mt-1 h-12" {...form.register("location")} />
            </div>
          </div>
          <div>
            <Label>Company Logo URL</Label>
            <Input className="mt-1 h-12" {...form.register("companyLogo")} />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
