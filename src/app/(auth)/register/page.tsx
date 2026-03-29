"use client";

import { signIn, useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, CheckCircle, Loader2, LockKeyhole, Mail, User, UserRound } from "lucide-react";
import { FadeIn } from "@/components/layout/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardPathForRole } from "@/config/roles";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

const roleCards = {
  JOB_SEEKER: {
    title: "Job Seeker",
    copy: "Discover roles, save opportunities, and track applications.",
    icon: UserRound,
    accent: "from-sky-500 to-cyan-500",
  },
  EMPLOYER: {
    title: "Employer",
    copy: "Publish jobs, review candidates, and manage hiring momentum.",
    icon: Briefcase,
    accent: "from-emerald-500 to-teal-500",
  },
} as const;

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [step, setStep] = useState<"role" | "details">("role");

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "JOB_SEEKER",
    },
  });
  const selectedRole = useWatch({
    control: form.control,
    name: "role",
  });

  useEffect(() => {
    if (session) {
      router.push(getDashboardPathForRole(session.user.role));
    }
  }, [session, router]);

  const onSubmit = async (values: RegisterForm) => {
    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || errorData.error || "Registration failed");
          return;
        }

        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (!result?.error) {
          const target =
            values.role === "EMPLOYER" ? "/dashboard/employer" : "/dashboard/job-seeker";
          router.push(target);
          router.refresh();
        }
      } catch {
        setError("Registration failed. Please try again.");
      }
    });
  };

  return (
    <FadeIn>
      <Card className="overflow-hidden border-white/80 bg-white/86">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="eyebrow">
              <CheckCircle className="h-3.5 w-3.5" />
              Create account
            </div>
            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Step {step === "role" ? "1" : "2"}
            </span>
          </div>
          <div>
            <CardTitle className="text-3xl">Start with the workflow that fits you.</CardTitle>
            <CardDescription className="mt-2 max-w-md">
              Choose your role first, then we&apos;ll set up the basics and route you into the right workspace.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error ? (
            <div className="rounded-[1.2rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          ) : null}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {step === "role" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(roleCards).map(([key, config]) => {
                  const Icon = config.icon;
                  const active = selectedRole === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => form.setValue("role", key as RegisterForm["role"])}
                      className={cn(
                        "rounded-[1.5rem] border p-5 text-left transition-all duration-200",
                        active
                          ? "border-slate-950 bg-slate-950 text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)]"
                          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm",
                          config.accent
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="mt-5 text-lg font-semibold">{config.title}</p>
                      <p className={cn("mt-2 text-sm leading-7", active ? "text-slate-200" : "text-slate-600")}>
                        {config.copy}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      {...form.register("name")}
                      className="h-14 pl-11"
                      disabled={isPending}
                      placeholder="Your full name"
                    />
                  </div>
                  {form.formState.errors.name ? (
                    <p className="text-sm text-rose-600">{form.formState.errors.name.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      {...form.register("email")}
                      type="email"
                      placeholder="you@company.com"
                      className="h-14 pl-11"
                      disabled={isPending}
                    />
                  </div>
                  {form.formState.errors.email ? (
                    <p className="text-sm text-rose-600">{form.formState.errors.email.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      {...form.register("password")}
                      type="password"
                      placeholder="At least 8 characters"
                      className="h-14 pl-11"
                      disabled={isPending}
                    />
                  </div>
                  {form.formState.errors.password ? (
                    <p className="text-sm text-rose-600">{form.formState.errors.password.message}</p>
                  ) : null}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              {step === "details" ? (
                <Button
                  type="button"
                  variant="outline"
                  className="sm:flex-1"
                  onClick={() => setStep("role")}
                >
                  Back
                </Button>
              ) : null}

              <Button
                type={step === "role" ? "button" : "submit"}
                className="sm:flex-1"
                disabled={isPending}
                onClick={() => {
                  if (step === "role") {
                    setStep("details");
                  }
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : step === "role" ? (
                  "Continue"
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>

          <div className="rounded-[1.3rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 text-sm leading-7 text-slate-600">
            Selected role: <span className="font-semibold text-slate-900">{roleCards[selectedRole].title}</span>
          </div>

          <div className="border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-sky-700 hover:text-sky-800">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
