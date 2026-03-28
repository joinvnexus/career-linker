"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Download,
  DollarSign,
  Receipt,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type PaymentItem = {
  id: string;
  jobTitle: string;
  companyName: string;
  ownerEmail: string;
  status: "PAID" | "FAILED" | "UNPAID";
  amountCents: number;
  currency: string;
  stripeSessionId?: string | null;
  paymentIntentId?: string | null;
  paidAt?: string | null;
  createdAt: string;
};

type PaymentsResponse = {
  summary: {
    paidCount: number;
    failedCount: number;
    unpaidCount: number;
    totalCount: number;
    paidRevenueCents: number;
    pendingRevenueCents: number;
    currency: string;
  };
  payments: PaymentItem[];
};

function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

export default function PaymentsPage() {
  const [data, setData] = useState<PaymentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const downloadCsv = (rows: string[][], fileName: string): void => {
    const csvContent = rows
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const loadPayments = async (): Promise<void> => {
      try {
        const response = await fetch("/api/admin/payments");
        const json = (await response.json()) as PaymentsResponse & { error?: string };

        if (!response.ok) {
          toast.error(json.error || "Failed to load payments");
          return;
        }

        setData(json);
      } catch {
        toast.error("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    void loadPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    const payments = data?.payments ?? [];

    return payments.filter((payment) => {
      const matchesStatus = statusFilter === "ALL" || payment.status === statusFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        payment.jobTitle.toLowerCase().includes(query) ||
        payment.companyName.toLowerCase().includes(query) ||
        payment.ownerEmail.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [data?.payments, searchQuery, statusFilter]);

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 w-full rounded-[28px]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full rounded-[24px]" />
          ))}
        </div>
      </div>
    );
  }

  const { summary } = data;

  const handleExport = (): void => {
    downloadCsv(
      [
        [
          "Job",
          "Company",
          "Owner Email",
          "Status",
          "Amount",
          "Created",
          "Paid At",
          "Session ID",
          "Payment Intent",
        ],
        ...filteredPayments.map((payment) => [
          payment.jobTitle,
          payment.companyName,
          payment.ownerEmail,
          payment.status,
          formatMoney(payment.amountCents, payment.currency),
          new Date(payment.createdAt).toLocaleDateString(),
          payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "",
          payment.stripeSessionId || "",
          payment.paymentIntentId || "",
        ]),
      ],
      "admin-payments-export.csv"
    );
    toast.success("Payment export downloaded");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#1e1b4b_0%,#312e81_44%,#0f172a_100%)] p-6 text-white shadow-[0_28px_90px_-54px_rgba(15,23,42,0.85)] sm:p-8">
        <Badge className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-100 hover:bg-white/10">
          Payments Ops
        </Badge>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Track live job-post payments from the existing billing flow.
            </h1>
            <p className="mt-3 text-sm text-slate-200 sm:text-base">
              This surface now reads real payment state from job listings, Stripe session
              references, and paid timestamps so admin teams can audit billing health.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[28rem]">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Paid revenue</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatMoney(summary.paidRevenueCents, summary.currency)}
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Pending value</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatMoney(summary.pendingRevenueCents, summary.currency)}
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Transactions</p>
              <p className="mt-2 text-2xl font-semibold">{summary.totalCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Paid Jobs"
          value={summary.paidCount}
          change={formatMoney(summary.paidRevenueCents, summary.currency)}
          trend="up"
          icon={<DollarSign className="h-7 w-7" />}
        />
        <StatsCard
          title="Unpaid Jobs"
          value={summary.unpaidCount}
          change={formatMoney(summary.pendingRevenueCents, summary.currency)}
          trend={summary.unpaidCount > 0 ? "down" : "neutral"}
          icon={<Receipt className="h-7 w-7" />}
        />
        <StatsCard
          title="Failed Payments"
          value={summary.failedCount}
          change="Needs employer follow-up"
          trend={summary.failedCount > 0 ? "down" : "neutral"}
          icon={<CreditCard className="h-7 w-7" />}
        />
      </div>

      <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-xl text-slate-950">Billing Activity</CardTitle>
            <p className="text-sm text-slate-500">
              Real payment signals derived from the current Stripe job-post flow.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 lg:w-auto">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </button>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="relative min-w-[16rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search job, company, email..."
                className="h-11 rounded-full border-slate-300 bg-white pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-full rounded-full border-slate-300 bg-white sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="UNPAID">Unpaid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredPayments.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No payment records matched the current filters.
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-slate-900">{payment.jobTitle}</p>
                      <Badge
                        variant={
                          payment.status === "PAID"
                            ? "success"
                            : payment.status === "FAILED"
                              ? "destructive"
                              : "secondary"
                        }
                        className="rounded-full px-3 py-1"
                      >
                        {payment.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>{payment.companyName}</span>
                      <span>{payment.ownerEmail}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>
                        Created {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        {payment.paidAt
                          ? `Paid ${new Date(payment.paidAt).toLocaleDateString()}`
                          : "Not paid yet"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-950 px-4 py-3 text-white">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Amount</p>
                    <p className="mt-2 text-2xl font-semibold">
                      {formatMoney(payment.amountCents, payment.currency)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Wallet className="h-4 w-4" />
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Session id
                      </p>
                    </div>
                    <p className="mt-2 truncate text-sm font-medium text-slate-900">
                      {payment.stripeSessionId || "Not created"}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CreditCard className="h-4 w-4" />
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Payment intent
                      </p>
                    </div>
                    <p className="mt-2 truncate text-sm font-medium text-slate-900">
                      {payment.paymentIntentId || "Awaiting payment"}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <ShieldCheck className="h-4 w-4" />
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Billing state
                      </p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {payment.status === "PAID"
                        ? "Settled and activated"
                        : payment.status === "FAILED"
                          ? "Payment failed"
                          : "Awaiting checkout completion"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
