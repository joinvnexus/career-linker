"use client"

import { useState, useEffect } from "react";
import { JobCard } from "@/components/job-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";

export default function AppliedJobsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchApplications();
    }
  }, [session]);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications?myApplied=1");
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Applied Jobs</h1>
      {applications.length === 0 ? (
        <Card className="border-0 text-center py-24">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-6">Start applying to jobs to see them here</p>
          <Link href="/jobs">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-600">
              Find Jobs
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {applications.map((app) => (
            <Card key={app.id} className="overflow-hidden hover:shadow-xl transition-all">
              <CardContent className="p-0 pt-6">
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="px-3 py-1 h-auto">{app.status.replace("_", " ").toUpperCase()}</Badge>
                  </div>
                  <JobCard 
                    job={app.job} 
                    employerId={app.job.employerId} 
                    userRole={session.user.role}
                    userId={session.user.id}
                  />
                </div>
                <div className="px-6 pb-6 pt-0 border-t bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                  {app.coverLetter && (
                    <p className="text-sm line-clamp-2">{app.coverLetter}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

