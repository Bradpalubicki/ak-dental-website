"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Activity,
  FileText,
  Plus,
  RefreshCw,
  ExternalLink,
  XCircle,
  Clock,
  Zap,
  BarChart2,
  Mail,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Keyword {
  id: string;
  keyword: string;
  category: string;
  target_url: string | null;
  current_rank: number | null;
  previous_rank: number | null;
  best_rank: number | null;
  search_volume: number | null;
  is_active: boolean;
}

interface VitalsSummary {
  summary: {
    lcp: number | null;
    cls: number | null;
    inp: number | null;
    samples: { lcp: number; cls: number; inp: number };
  };
  byPage: { page: string; lcp: number | null; cls: number | null; inp: number | null; samples: number }[];
  trend: { date: string; lcp: number | null }[];
}

interface AuditIssue {
  issue: { type: string; page: string; description: string; fix?: string };
  fixed: boolean;
  error?: string;
}

interface AuditData {
  latest: {
    id: string;
    overall_score: number;
    issues_critical: number;
    issues_warning: number;
    issues_detail: AuditIssue[] | null;
    created_at: string;
  } | null;
  history: { overall_score: number; issues_critical: number; issues_warning: number; created_at: string }[];
}

interface Report {
  id: string;
  report_month: string;
  overall_score: number | null;
  sent_to_client: boolean;
  sent_at: string | null;
  created_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function RankChange({ current, previous }: { current: number | null; previous: number | null }) {
  if (!current || !previous) return <Minus className="h-4 w-4 text-slate-400" />;
  const diff = previous - current;
  if (diff > 0)
    return (
      <span className="flex items-center text-emerald-600 text-sm font-medium">
        <TrendingUp className="h-3.5 w-3.5 mr-1" />+{diff}
      </span>
    );
  if (diff < 0)
    return (
      <span className="flex items-center text-red-500 text-sm font-medium">
        <TrendingDown className="h-3.5 w-3.5 mr-1" />
        {diff}
      </span>
    );
  return <Minus className="h-4 w-4 text-slate-400" />;
}

function vitalStatus(name: string, value: number | null): "good" | "needs-improvement" | "poor" | "no-data" {
  if (value === null) return "no-data";
  if (name === "LCP") return value <= 2500 ? "good" : value <= 4000 ? "needs-improvement" : "poor";
  if (name === "CLS") return value <= 0.1 ? "good" : value <= 0.25 ? "needs-improvement" : "poor";
  if (name === "INP") return value <= 200 ? "good" : value <= 500 ? "needs-improvement" : "poor";
  return "no-data";
}

function VitalBadge({ status }: { status: ReturnType<typeof vitalStatus> }) {
  const map = {
    good: "bg-emerald-100 text-emerald-700",
    "needs-improvement": "bg-amber-100 text-amber-700",
    poor: "bg-red-100 text-red-700",
    "no-data": "bg-slate-100 text-slate-500",
  };
  const label = { good: "Good", "needs-improvement": "Needs Work", poor: "Poor", "no-data": "No data" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status]}`}>{label[status]}</span>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-500" : "text-red-500";
  return (
    <div className="flex flex-col items-center justify-center">
      <span className={`text-4xl font-bold ${color}`}>{score}</span>
      <span className="text-xs text-slate-400 mt-0.5">/ 100</span>
    </div>
  );
}

function formatVitalValue(name: string, value: number | null): string {
  if (value === null) return "--";
  if (name === "LCP") return `${(value / 1000).toFixed(2)}s`;
  if (name === "CLS") return value.toFixed(3);
  if (name === "INP") return `${Math.round(value)}ms`;
  return String(value);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SEODashboardClient() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [newKeyword, setNewKeyword] = useState("");
  const [addingKeyword, setAddingKeyword] = useState(false);

  // Vitals
  const [vitals, setVitals] = useState<VitalsSummary | null>(null);
  const [vitalsLoading, setVitalsLoading] = useState(false);

  // Audit
  const [audit, setAudit] = useState<AuditData | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditResult, setAuditResult] = useState<{ issuesFound: number; issuesFixed: number } | null>(null);

  // Reports
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  const fetchKeywords = useCallback(async () => {
    try {
      const res = await fetch("/api/seo/keywords");
      if (res.ok) setKeywords(await res.json());
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVitals = useCallback(async () => {
    setVitalsLoading(true);
    try {
      const res = await fetch("/api/seo/vitals/summary");
      if (res.ok) setVitals(await res.json());
    } catch {
      // noop
    } finally {
      setVitalsLoading(false);
    }
  }, []);

  const fetchAudit = useCallback(async () => {
    setAuditLoading(true);
    try {
      const res = await fetch("/api/seo/audit");
      if (res.ok) setAudit(await res.json());
    } catch {
      // noop
    } finally {
      setAuditLoading(false);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const res = await fetch("/api/seo/reports");
      if (res.ok) setReports(await res.json());
    } catch {
      // noop
    } finally {
      setReportsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  // Lazy-load tabs
  useEffect(() => {
    if (activeTab === "vitals" && !vitals) fetchVitals();
    if (activeTab === "audit" && !audit) fetchAudit();
    if (activeTab === "reports" && reports.length === 0) fetchReports();
  }, [activeTab, vitals, audit, reports.length, fetchVitals, fetchAudit, fetchReports]);

  const addKeyword = async () => {
    if (!newKeyword.trim()) return;
    setAddingKeyword(true);
    try {
      const res = await fetch("/api/seo/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: newKeyword.trim() }),
      });
      if (res.ok) {
        setNewKeyword("");
        fetchKeywords();
      }
    } catch {
      // noop
    } finally {
      setAddingKeyword(false);
    }
  };

  const runAudit = async () => {
    setRunningAudit(true);
    setAuditResult(null);
    try {
      const res = await fetch("/api/seo/audit", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setAuditResult({
            issuesFound: data.report.issuesFound,
            issuesFixed: data.report.issuesFixed,
          });
        }
        fetchAudit();
      }
    } catch {
      // noop
    } finally {
      setRunningAudit(false);
    }
  };

  const rankedKeywords = keywords.filter((k) => k.current_rank);
  const avgRank =
    rankedKeywords.length > 0
      ? (rankedKeywords.reduce((sum, k) => sum + (k.current_rank || 0), 0) / rankedKeywords.length).toFixed(1)
      : "--";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SEO Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor search performance, keyword rankings, and site health
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchKeywords();
            if (activeTab === "vitals") fetchVitals();
            if (activeTab === "audit") fetchAudit();
            if (activeTab === "reports") fetchReports();
          }}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* ── Overview ──────────────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Tracked Keywords</p>
                    <p className="text-3xl font-bold text-slate-900">{keywords.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                    <Search className="h-6 w-6 text-cyan-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Avg. Position</p>
                    <p className="text-3xl font-bold text-slate-900">{avgRank}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Top 10 Rankings</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {keywords.filter((k) => k.current_rank && k.current_rank <= 10).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Site Health</p>
                    <p className="text-3xl font-bold text-emerald-600">Good</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" asChild>
                <a href="/api/seo/indexnow" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  IndexNow Status
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/llms.txt" target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  View llms.txt
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  View Sitemap
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/robots.txt" target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  View robots.txt
                </a>
              </Button>
            </CardContent>
          </Card>

          {keywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {keywords.slice(0, 5).map((kw) => (
                    <div
                      key={kw.id}
                      className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                    >
                      <div>
                        <span className="font-medium text-slate-900">{kw.keyword}</span>
                        <span className="ml-2 text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">
                          {kw.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-slate-600">
                          {kw.current_rank ? `#${kw.current_rank}` : "--"}
                        </span>
                        <RankChange current={kw.current_rank} previous={kw.previous_rank} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Keywords ──────────────────────────────────────────────────────── */}
        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                  placeholder="Add a keyword to track..."
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Button onClick={addKeyword} disabled={addingKeyword || !newKeyword.trim()} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <p className="text-sm text-slate-500 text-center py-8">Loading keywords...</p>
              ) : keywords.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No keywords tracked yet</p>
                  <p className="text-sm text-slate-400 mt-1">Add keywords above to start tracking rankings</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-2 font-medium text-slate-500">Keyword</th>
                        <th className="text-left py-3 px-2 font-medium text-slate-500">Category</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">Rank</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">Change</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">Best</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywords.map((kw) => (
                        <tr key={kw.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-2 font-medium text-slate-900">{kw.keyword}</td>
                          <td className="py-3 px-2">
                            <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">
                              {kw.category}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center font-mono">
                            {kw.current_rank ? `#${kw.current_rank}` : "--"}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <RankChange current={kw.current_rank} previous={kw.previous_rank} />
                          </td>
                          <td className="py-3 px-2 text-center font-mono text-slate-500">
                            {kw.best_rank ? `#${kw.best_rank}` : "--"}
                          </td>
                          <td className="py-3 px-2 text-center text-slate-500">
                            {kw.search_volume?.toLocaleString() || "--"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Audit ─────────────────────────────────────────────────────────── */}
        <TabsContent value="audit" className="space-y-6">
          {/* Run Audit */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">SEO Audit Scanner</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Checks schema markup, meta tags, canonical links, and image dimensions across all pages.
                  </p>
                </div>
                <Button onClick={runAudit} disabled={runningAudit} size="sm" className="gap-2 shrink-0">
                  {runningAudit ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlayCircle className="h-4 w-4" />
                  )}
                  {runningAudit ? "Scanning…" : "Run Audit"}
                </Button>
              </div>
              {auditResult && (
                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 flex gap-6">
                  <div className="text-sm">
                    <span className="text-slate-500">Issues found:</span>{" "}
                    <span className={`font-semibold ${auditResult.issuesFound > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                      {auditResult.issuesFound}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">Auto-fixed:</span>{" "}
                    <span className="font-semibold text-slate-900">{auditResult.issuesFixed}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Latest Score */}
          {auditLoading ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300 mx-auto" />
              </CardContent>
            </Card>
          ) : audit?.latest ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 flex flex-col items-center justify-center py-8">
                    <p className="text-sm text-slate-500 mb-3">Overall Score</p>
                    <ScoreRing score={audit.latest.overall_score} />
                    <p className="text-xs text-slate-400 mt-3">
                      {new Date(audit.latest.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Critical Issues</p>
                        <p className="text-3xl font-bold text-red-500">{audit.latest.issues_critical}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">Schema, meta description, canonical tags</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Warnings</p>
                        <p className="text-3xl font-bold text-amber-500">{audit.latest.issues_warning}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">Image dimensions, performance hints</p>
                  </CardContent>
                </Card>
              </div>

              {/* Issues Detail */}
              {audit.latest.issues_detail && audit.latest.issues_detail.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Issue Breakdown</CardTitle>
                    <CardDescription>
                      {audit.latest.issues_detail.length} issue(s) detected in last scan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {audit.latest.issues_detail.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          {item.issue.type === "schema" || item.issue.type === "meta" ? (
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                                {item.issue.type}
                              </span>
                              <span className="text-xs text-slate-500 truncate">{item.issue.page}</span>
                            </div>
                            <p className="text-sm text-slate-700 mt-1">{item.issue.description}</p>
                            {item.issue.fix && (
                              <p className="text-xs text-emerald-600 mt-0.5">Suggested: {item.issue.fix}</p>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              item.fixed
                                ? "border-emerald-200 text-emerald-700"
                                : "border-slate-200 text-slate-500"
                            }
                          >
                            {item.fixed ? "Fixed" : "Manual"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Score History */}
              {audit.history.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Score History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {audit.history.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                        >
                          <span className="text-sm text-slate-500">
                            {new Date(h.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-red-500">{h.issues_critical} critical</span>
                            <span className="text-xs text-amber-500">{h.issues_warning} warnings</span>
                            <span
                              className={`font-semibold text-sm ${
                                h.overall_score >= 80
                                  ? "text-emerald-600"
                                  : h.overall_score >= 60
                                  ? "text-amber-500"
                                  : "text-red-500"
                              }`}
                            >
                              {h.overall_score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-10">
                  <BarChart2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No audit results yet</p>
                  <p className="text-sm text-slate-400 mt-1">Run your first audit above to see results.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Vitals ────────────────────────────────────────────────────────── */}
        <TabsContent value="vitals" className="space-y-6">
          {vitalsLoading ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300 mx-auto" />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Core 3 metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(
                  [
                    { name: "LCP", label: "Largest Contentful Paint", threshold: "< 2.5s", icon: Clock },
                    { name: "CLS", label: "Cumulative Layout Shift", threshold: "< 0.1", icon: Activity },
                    { name: "INP", label: "Interaction to Next Paint", threshold: "< 200ms", icon: Zap },
                  ] as const
                ).map(({ name, label, threshold, icon: Icon }) => {
                  const value = vitals?.summary[name.toLowerCase() as "lcp" | "cls" | "inp"] ?? null;
                  const status = vitalStatus(name, value);
                  const samples = vitals?.summary.samples[name.toLowerCase() as "lcp" | "cls" | "inp"] ?? 0;
                  return (
                    <Card key={name}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="h-10 w-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-cyan-600" />
                          </div>
                          <VitalBadge status={status} />
                        </div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{name}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">
                          {formatVitalValue(name, value)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{label}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          Target: {threshold} · {samples} sample{samples !== 1 ? "s" : ""}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Per-page breakdown */}
              {vitals && vitals.byPage.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Per-Page Breakdown</CardTitle>
                    <CardDescription>p75 values from real user measurements (last 30 days)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-2 font-medium text-slate-500">Page</th>
                            <th className="text-center py-3 px-2 font-medium text-slate-500">LCP</th>
                            <th className="text-center py-3 px-2 font-medium text-slate-500">CLS</th>
                            <th className="text-center py-3 px-2 font-medium text-slate-500">INP</th>
                            <th className="text-center py-3 px-2 font-medium text-slate-500">Samples</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vitals.byPage.map((row) => (
                            <tr key={row.page} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="py-3 px-2 font-mono text-xs text-slate-600 truncate max-w-xs">
                                {row.page}
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span
                                  className={
                                    vitalStatus("LCP", row.lcp) === "good"
                                      ? "text-emerald-600 font-medium"
                                      : vitalStatus("LCP", row.lcp) === "needs-improvement"
                                      ? "text-amber-600 font-medium"
                                      : "text-red-500 font-medium"
                                  }
                                >
                                  {formatVitalValue("LCP", row.lcp)}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span
                                  className={
                                    vitalStatus("CLS", row.cls) === "good"
                                      ? "text-emerald-600 font-medium"
                                      : vitalStatus("CLS", row.cls) === "needs-improvement"
                                      ? "text-amber-600 font-medium"
                                      : "text-red-500 font-medium"
                                  }
                                >
                                  {formatVitalValue("CLS", row.cls)}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span
                                  className={
                                    vitalStatus("INP", row.inp) === "good"
                                      ? "text-emerald-600 font-medium"
                                      : vitalStatus("INP", row.inp) === "needs-improvement"
                                      ? "text-amber-600 font-medium"
                                      : "text-red-500 font-medium"
                                  }
                                >
                                  {formatVitalValue("INP", row.inp)}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center text-slate-500">{row.samples}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-10">
                      <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No Web Vitals data yet</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Real user metrics are collected automatically as visitors browse the site.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Thresholds reference */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Google Thresholds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {[
                      { metric: "LCP", good: "≤ 2.5s", needs: "2.5–4.0s", poor: "> 4.0s" },
                      { metric: "CLS", good: "≤ 0.1", needs: "0.1–0.25", poor: "> 0.25" },
                      { metric: "INP", good: "≤ 200ms", needs: "200–500ms", poor: "> 500ms" },
                    ].map((row) => (
                      <div key={row.metric} className="space-y-1.5">
                        <p className="font-medium text-slate-700">{row.metric}</p>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          <span className="text-slate-600">{row.good}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                          <span className="text-slate-600">{row.needs}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                          <span className="text-slate-600">{row.poor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* ── Reports ───────────────────────────────────────────────────────── */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly SEO Reports</CardTitle>
              <CardDescription>
                Auto-generated on the 1st of each month and emailed to the client.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-300 mx-auto" />
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No reports generated yet</p>
                  <p className="text-sm text-slate-400 mt-1">
                    The first report will be generated on the 1st of next month.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-2 font-medium text-slate-500">Month</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">Score</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">Sent</th>
                        <th className="text-left py-3 px-2 font-medium text-slate-500">Sent At</th>
                        <th className="text-left py-3 px-2 font-medium text-slate-500">Generated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((r) => {
                        const monthDate = new Date(r.report_month + "T12:00:00Z");
                        return (
                          <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-2 font-medium text-slate-900">
                              {monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </td>
                            <td className="py-3 px-2 text-center">
                              {r.overall_score !== null ? (
                                <span
                                  className={`font-semibold ${
                                    r.overall_score >= 80
                                      ? "text-emerald-600"
                                      : r.overall_score >= 60
                                      ? "text-amber-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {r.overall_score}
                                </span>
                              ) : (
                                <span className="text-slate-400">--</span>
                              )}
                            </td>
                            <td className="py-3 px-2 text-center">
                              {r.sent_to_client ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                                  <Mail className="h-3.5 w-3.5" />
                                  Sent
                                </span>
                              ) : (
                                <span className="text-slate-400 text-xs">Pending</span>
                              )}
                            </td>
                            <td className="py-3 px-2 text-slate-500">
                              {r.sent_at
                                ? new Date(r.sent_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "--"}
                            </td>
                            <td className="py-3 px-2 text-slate-500">
                              {new Date(r.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info card */}
          <Card className="border-cyan-100 bg-cyan-50/50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-cyan-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Automatic Monthly Delivery</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Reports include keyword rankings, Core Web Vitals (p75), Google Search Console
                    traffic data, and site audit scores. Delivered on the 1st of each month to the
                    practice email and NuStack.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
