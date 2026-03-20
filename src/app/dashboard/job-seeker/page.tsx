"use client"

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Bookmark, TrendingUp, Award, Calendar } from "lucide-react";
import Link from "next/link";

export default function JobSeekerOverview() {
  const { data: session } = useSession();

  const stats = [
    { label: "Applications Sent", value: "2", change: "+1", icon: FileText, color: "blue" },
    { label: "Saved Jobs", value: "5", change: "0", icon: Bookmark, color: "emerald" },
    { label: "Interviews Scheduled", value: "1", change: "+1", icon: Calendar, color: "purple" },
    { label: "Profile Completion", value: "75%", change: "", icon: TrendingUp, color: "orange" },
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session?.user.name}</h1>
        <Link href="/dashboard/job-seeker/profile">
          <Button>Update Profile</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <Card key={i} className="border-0 shadow-xl group hover:shadow-2xl transition-all">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-{stat.color}-500 to-{stat.color}-600 group-hover:scale-105 transition-transform">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <CardTitle className="text-3xl font-bold text-gray-900">{stat.value}</CardTitle>
                  <CardDescription className="text-sm">{stat.label}</CardDescription>
                </div>
              </div>
            </CardHeader>
            {stat.change && (
              <CardContent className="pt-0 pb-4">
                <Badge className="bg-green-100 text-green-800">Recent {stat.change}</Badge>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all group">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Applied Jobs</CardTitle>
                <CardDescription>Track your applications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/job-seeker/applied">
              <Button className="w-full group-hover:bg-blue-600">View Applications</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all group">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                <Bookmark className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Saved Jobs</CardTitle>
                <CardDescription>Your bookmarked opportunities</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/job-seeker/saved">
              <Button className="w-full group-hover:bg-emerald-600">View Saved</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all group">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Profile</CardTitle>
                <CardDescription>Complete your profile</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/job-seeker/profile">
              <Button className="w-full group-hover:bg-purple-600">Edit Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Applied to Frontend Developer</p>
                <p className="text-sm text-gray-600">TechCorp • Pending</p>
              </div>
              <div className="text-sm text-gray-500">2 days ago</div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Interview Scheduled</p>
                <p className="text-sm text-gray-600">Senior Product Manager • Interview</p>
              </div>
              <div className="text-sm text-gray-500">1 day ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

