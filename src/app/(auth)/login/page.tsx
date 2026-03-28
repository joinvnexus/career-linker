"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { Suspense, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";
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
    <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center">
          <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 p-3">
            <Mail className="h-10 w-10 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue to Career-Linker</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...form.register("email")}
              className="h-12"
              disabled={isPending}
            />
            {form.formState.errors.email ? (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              {...form.register("password")}
              className="h-12"
              disabled={isPending}
            />
            {form.formState.errors.password ? (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            ) : null}
          </div>
          <Button
            type="submit"
            className="h-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-blue-800"
            disabled={isPending}
          >
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
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="rounded-2xl border border-slate-200 bg-white/70 p-8">Loading...</div>}
    >
      <LoginPageContent />
    </Suspense>
  );
}
