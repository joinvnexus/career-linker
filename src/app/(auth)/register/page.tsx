"use client"

import { signIn, useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Briefcase, Mail, Lock, CheckCircle } from "lucide-react"
type Role = "JOB_SEEKER" | "EMPLOYER"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [step, setStep] = useState<"role" | "details">("role")
  
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "JOB_SEEKER",
    },
  })

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  const onSubmit = async (values: RegisterForm) => {
    setError("")
    startTransition(async () => {
      try {
        // Register user via API or server action
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          const errorData = await response.json()
          setError(errorData.message || errorData.error || "Registration failed")
          return
        }

        // Auto sign in
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        })

        if (!result?.error) {
          const target =
            values.role === "EMPLOYER" ? "/dashboard/employer" : "/dashboard/job-seeker"
          router.push(target)
          router.refresh()
        }
      } catch (err) {
        setError("Registration failed. Please try again.")
      }
    })
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl flex items-center justify-center shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Join HireHub
          </CardTitle>
          <CardDescription className="text-lg">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 pt-0.5">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === "role" && (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700">Select your role</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => form.setValue("role", "JOB_SEEKER")}
                    className={`border-2 rounded-xl p-4 text-left transition-all ${
                      form.watch("role") === "JOB_SEEKER"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Job Seeker</p>
                        <p className="text-sm text-gray-600">Find and apply to jobs</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => form.setValue("role", "EMPLOYER")}
                    className={`border-2 rounded-xl p-4 text-left transition-all ${
                      form.watch("role") === "EMPLOYER"
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Employer</p>
                        <p className="text-sm text-gray-600">Post jobs and hire</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {step === "details" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </label>
                  <Input
                    {...form.register("name")}
                    className="h-14 rounded-xl border-2 focus:border-blue-500"
                    disabled={isPending}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <Input
                    {...form.register("email")}
                    type="email"
                    placeholder="your@email.com"
                    className="h-14 rounded-xl border-2 focus:border-blue-500"
                    disabled={isPending}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </label>
                  <Input
                    {...form.register("password")}
                    type="password"
                    placeholder="At least 8 characters"
                    className="h-14 rounded-xl border-2 focus:border-blue-500"
                    disabled={isPending}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>
              </>
            )}

            <Button 
              type={step === "role" ? "button" : "submit"}
              className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-lg shadow-xl rounded-xl transform hover:-translate-y-0.5 transition-all duration-200"
              disabled={isPending}
              onClick={() => {
                if (step === "role") setStep("details")
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : step === "role" ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Continue
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

