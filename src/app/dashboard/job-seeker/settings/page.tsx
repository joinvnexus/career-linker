"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Globe2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCog,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SettingsState = {
  jobAlerts: boolean;
  recruiterMessages: boolean;
  applicationUpdates: boolean;
  weeklyDigest: boolean;
  profileVisibility: "PUBLIC" | "LIMITED" | "PRIVATE";
  resumeAccess: "OPEN" | "REQUEST_ONLY";
  discoverability: boolean;
  language: "EN" | "BN";
  timezone: string;
  region: string;
};

const STORAGE_KEY = "career-linker.job-seeker-settings";

const defaultSettings: SettingsState = {
  jobAlerts: true,
  recruiterMessages: true,
  applicationUpdates: true,
  weeklyDigest: false,
  profileVisibility: "PUBLIC",
  resumeAccess: "REQUEST_ONLY",
  discoverability: true,
  language: "EN",
  timezone: "Asia/Dhaka",
  region: "Bangladesh",
};

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-4 rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4 text-left transition-colors hover:border-slate-300 hover:bg-white"
    >
      <div>
        <p className="font-medium text-slate-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <span
        aria-hidden="true"
        className={`relative mt-1 inline-flex h-7 w-12 flex-shrink-0 rounded-full transition-colors ${
          checked ? "bg-slate-950" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}

function PreferenceCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof UserCog;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-white/80 bg-white/94">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-slate-950 text-white shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-950">{title}</CardTitle>
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">{children}</CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings({ ...defaultSettings, ...(JSON.parse(stored) as Partial<SettingsState>) });
      }
    } catch {
      toast.error("Could not load saved preferences");
    } finally {
      setHydrated(true);
    }
  }, []);

  const updateSettings = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const saveSettings = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      setSavedAt(timestamp);
      toast.success("Preferences saved on this device");
    } catch {
      toast.error("Could not save preferences");
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
      setSavedAt(null);
      toast.success("Preferences reset");
    } catch {
      toast.error("Could not reset preferences");
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="surface-inverse relative overflow-hidden rounded-[2rem] border border-white/10 p-5 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(148,163,184,0.20),_transparent_22%)]" />
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)]">
          <div className="max-w-2xl">
            <div className="eyebrow border-white/10 bg-white/10 text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Preferences
            </div>
            <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] text-white lg:text-5xl">
              Tune the dashboard around how you work.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              Control alerts, visibility, and regional behavior with settings that are
              easier to manage on mobile and desktop.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button className="w-full sm:w-auto" onClick={saveSettings} type="button">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Save preferences
              </Button>
              <Button
                className="w-full sm:w-auto border-white/20 bg-white/10 text-white hover:bg-white/15"
                onClick={resetSettings}
                type="button"
                variant="outline"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-white">Quick status</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-white" />
                  <div>
                    <p className="font-medium text-white">
                      {settings.jobAlerts || settings.applicationUpdates
                        ? "Notifications active"
                        : "Notifications reduced"}
                    </p>
                    <p className="text-sm text-slate-200/85">
                      {settings.recruiterMessages
                        ? "Recruiter messages can still reach you."
                        : "Recruiter messages are muted on this device."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-white" />
                  <div>
                    <p className="font-medium text-white">
                      {settings.profileVisibility === "PUBLIC"
                        ? "Profile widely visible"
                        : settings.profileVisibility === "LIMITED"
                          ? "Profile visible by request"
                          : "Profile kept private"}
                    </p>
                    <p className="text-sm text-slate-200/85">
                      {savedAt ? `Saved at ${savedAt}` : hydrated ? "Unsaved changes are local." : "Loading preferences..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <PreferenceCard
          icon={Bell}
          title="Notifications"
          description="Control what reaches you and keep the mobile experience quiet or active depending on your job search pace."
        >
          <ToggleRow
            title="Application updates"
            description="Get notified when employers review, shortlist, or reject your applications."
            checked={settings.applicationUpdates}
            onChange={(value) => updateSettings("applicationUpdates", value)}
          />
          <ToggleRow
            title="Recommended jobs"
            description="Receive role suggestions based on your saved jobs and profile direction."
            checked={settings.jobAlerts}
            onChange={(value) => updateSettings("jobAlerts", value)}
          />
          <ToggleRow
            title="Recruiter messages"
            description="Keep direct outreach and reminders visible inside your workflow."
            checked={settings.recruiterMessages}
            onChange={(value) => updateSettings("recruiterMessages", value)}
          />
          <ToggleRow
            title="Weekly digest"
            description="Bundle updates into a lighter weekly summary instead of constant pings."
            checked={settings.weeklyDigest}
            onChange={(value) => updateSettings("weeklyDigest", value)}
          />
        </PreferenceCard>

        <PreferenceCard
          icon={ShieldCheck}
          title="Privacy"
          description="Decide how discoverable you are while still keeping the dashboard easy to manage on a phone."
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-950">Profile visibility</p>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value: SettingsState["profileVisibility"]) =>
                updateSettings("profileVisibility", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Visible to recruiters</SelectItem>
                <SelectItem value="LIMITED">Limited visibility</SelectItem>
                <SelectItem value="PRIVATE">Keep private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-950">Resume access</p>
            <Select
              value={settings.resumeAccess}
              onValueChange={(value: SettingsState["resumeAccess"]) =>
                updateSettings("resumeAccess", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose resume access" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REQUEST_ONLY">Request before download</SelectItem>
                <SelectItem value="OPEN">Open to recruiters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ToggleRow
            title="Search discoverability"
            description="Let recruiters surface your profile in internal search and recommendation flows."
            checked={settings.discoverability}
            onChange={(value) => updateSettings("discoverability", value)}
          />
        </PreferenceCard>

        <PreferenceCard
          icon={Globe2}
          title="Region"
          description="Keep language, timezone, and regional context aligned with where and how you search."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-950">Language</p>
              <Select
                value={settings.language}
                onValueChange={(value: SettingsState["language"]) =>
                  updateSettings("language", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN">English</SelectItem>
                  <SelectItem value="BN">Bangla</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-950">Timezone</p>
              <Select
                value={settings.timezone}
                onValueChange={(value) => updateSettings("timezone", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Dhaka">Asia/Dhaka</SelectItem>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-950">Communication region</p>
            <Input
              placeholder="Bangladesh"
              value={settings.region}
              onChange={(event) => updateSettings("region", event.target.value)}
            />
          </div>
        </PreferenceCard>

        <PreferenceCard
          icon={UserCog}
          title="Account"
          description="Guide the user through the right next action even when the deeper account system lives elsewhere."
        >
          <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4">
            <p className="font-medium text-slate-950">Account changes live in profile today</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Email, resume links, and profile details can be reviewed from the profile
              editor while deeper account management is still being expanded.
            </p>
            <Link href="/dashboard/job-seeker/profile" className="mt-4 inline-flex">
              <Button variant="outline">
                Review profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </PreferenceCard>
      </div>

      <Card className="border-rose-200/80 bg-[linear-gradient(180deg,_rgba(255,241,242,0.96),_rgba(255,228,230,0.82))]">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-white text-rose-600 shadow-sm">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-rose-950">Danger zone</p>
              <p className="mt-1 text-sm leading-6 text-rose-800">
                If you need to leave, export important application history and resume links
                first. Account deletion is not wired here yet.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-rose-300 bg-white text-rose-700 hover:bg-rose-50"
            onClick={() => {
              toast.message("Deletion flow is not connected yet");
            }}
          >
            Review account status
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
