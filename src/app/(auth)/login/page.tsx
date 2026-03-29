"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";
import { Suspense, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";
import { FadeIn } from "@/components/layout/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginForm): void => {
    setError("");
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        const callbackUrl = searchParams.get("callbackUrl");
        router.push(callbackUrl || "/dashboard");
        router.refresh();
      }
    });
  };

  return (
    <FadeIn>
      <Card className="overflow-hidden border-white/80 bg-white/86">
        <CardHeader className="space-y-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <div className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" />
              Welcome back
            </div>
            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Login
            </span>
          </div>
          <div>
            <CardTitle className="text-3xl">Continue your hiring workflow.</CardTitle>
            <CardDescription className="mt-2 max-w-md">
              Sign in to revisit saved roles, manage applicants, or continue where your team left off.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {error ? (
            <div className="rounded-[1.2rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          ) : null}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  {...form.register("email")}
                  className="h-14 pl-11"
                  disabled={isPending}
                />
              </div>
              {form.formState.errors.email ? (
                <p className="text-sm text-rose-600">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...form.register("password")}
                  className="h-14 pl-11"
                  disabled={isPending}
                />
              </div>
              {form.formState.errors.password ? (
                <p className="text-sm text-rose-600">{form.formState.errors.password.message}</p>
              ) : null}
            </div>

            <Button type="submit" className="h-14 w-full text-base" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="rounded-[1.3rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 text-sm leading-7 text-slate-600">
            Returning users land back in their relevant dashboard flow after sign-in.
          </div>

          <div className="border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-sky-700 hover:text-sky-800">
              Create one
            </Link>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="rounded-[1.6rem] border border-slate-200 bg-white/80 p-8">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
