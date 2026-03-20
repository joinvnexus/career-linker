"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, FileText, Calendar } from "lucide-react";

export default function EmployerApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all applications across jobs for employer
    // For MVP, stub or fetch recent
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      // Stub API call - aggregate applications across jobs
      const res = await fetch("/api/applications?jobId=all"); // Future enhancement
      const data = await res.json();
      setApplicants(data.applications || generateStubData());
    } catch (error) {
      setApplicants(generateStubData());
    } finally {
      setLoading(false);
    }
  };

  const generateStubData = () => [
    {
      id: "1",
      seeker: { name: "Rahat Khan", email: "rahat@test.com", headline: "Fresh Graduate" },
      jobTitle: "Junior React Developer",
      status: "SHORTLISTED",
      createdAt: "2024-10-01",
      coverLetter: "Excited about this opportunity...",
    },
    {
      id: "2",
      seeker: { name: "Nazneen Ahmed", email: "nazneen@test.com", headline: "Experienced Professional" },
      jobTitle: "Product Manager",
      status: "INTERVIEW",
      createdAt: "2024-10-02",
      coverLetter: "10+ years experience...",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
        <div className="ml-auto">
          <Button>Export CSV</Button>
        </div>
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {applicants.map((app) => (
            <div key={app.id} className="flex items-center gap-4 p-6 border rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg truncate">{app.seeker.name}</h3>
                  <Badge variant={app.status === "PENDING" ? "secondary" : "default"}>
                    {app.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1 truncate">{app.seeker.headline}</p>
                <p className="text-sm font-medium mb-2">{app.jobTitle}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{app.coverLetter}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium mb-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">View Resume</Button>
                  <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-green-500">Shortlist</Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

