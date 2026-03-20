"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const profileSchema = z.object({
  headline: z.string().min(10, "Headline too short").max(160),
  phone: z.string().optional(),
  location: z.string().optional(),
  resumeUrl: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      headline: "",
      phone: "",
      location: "",
      resumeUrl: "",
    },
  });

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profiles/seeker");
      const data = await res.json();
      setProfile(data.profile);
      if (data.profile) {
        form.reset(data.profile);
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/profiles/seeker", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Profile updated!");
        fetchProfile();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-12" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="ml-auto">
          <Button type="submit" form="profileForm" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-xl max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form id="profileForm" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="headline">Headline *</Label>
              <Input
                id="headline"
                placeholder="e.g. Full Stack Developer passionate about React and Node.js"
                {...form.register("headline")}
                className="h-14 text-lg"
              />
              {form.formState.errors.headline && (
                <p className="text-red-500 text-sm">{form.formState.errors.headline.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+880 17XX XXX XXX"
                  {...form.register("phone")}
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Dhaka, Bangladesh"
                  {...form.register("location")}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="resumeUrl">Resume / Portfolio</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="resumeUrl"
                  placeholder="https://your-resume.pdf or portfolio"
                  {...form.register("resumeUrl")}
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">Add your resume URL or upload file (coming soon)</p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                Profile completion: <span className="font-bold text-emerald-600">75%</span>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Completion Tips */}
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              Profile Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
              <p>Add a professional headline to stand out</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <p>Upload your resume - increases responses by 40%</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
              <p>Complete location and phone for local opportunities</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

