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
  Gauge,
  Monitor,
  Smartphone,
  Link2,
  Eye,
  MousePointerClick,
  MapPin,
  Download,
  ChevronDown,
  ChevronUp,
  Sparkles,
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
  cluster_id: string | null;
  intent: string | null;
  notes: string | null;
}

interface KeywordCluster {
  id: string;
  name: string;
  color: string;
  description: string | null;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  excerpt: string | null;
  category: string | null;
  status: "draft" | "published" | "archived";
  primary_keyword_id: string | null;
  supporting_keyword_ids: string[];
  word_count: number | null;
  published_at: string | null;
  ai_generated: boolean;
  created_at: string;
  content_body: string | null;
  content_outline: string | null;
  primary_keyword?: { keyword: string; current_rank: number | null } | null;
}

interface KeywordSuggestion {
  keyword: string;
  category: string;
  intent: string;
  est_volume: number;
  rationale: string;
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
  narrative: string | null;
  sent_to_client: boolean;
  sent_at: string | null;
  created_at: string;
}

interface PageSpeedOpportunity {
  id: string;
  title: string;
  displayValue: string;
  numericValue: number;
}

interface PageSpeedScore {
  id: string;
  url: string;
  strategy: "mobile" | "desktop";
  performance_score: number | null;
  lcp: number | null;
  cls: number | null;
  inp: number | null;
  fcp: number | null;
  ttfb: number | null;
  speed_index: number | null;
  opportunities: PageSpeedOpportunity[] | null;
  created_at: string;
}

interface PageSpeedData {
  mobile: PageSpeedScore | null;
  desktop: PageSpeedScore | null;
  cached: boolean;
  cachedAt?: string;
  needsRun?: boolean;
}

interface GSCSummary {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GSCQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GSCStatus {
  connected: boolean;
  summary: GSCSummary | null;
  topQueries: GSCQuery[];
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

// ─── PageSpeed Gauge ──────────────────────────────────────────────────────────

function PSGauge({ score, label }: { score: number | null; label: string }) {
  if (score === null) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-slate-200">
          <span className="text-slate-400 text-sm">--</span>
        </div>
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
    );
  }
  const color =
    score >= 90 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label90 = score >= 90 ? "Fast" : score >= 50 ? "Needs Work" : "Slow";
  const circumference = 2 * Math.PI * 38;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{label90}</p>
      </div>
    </div>
  );
}

function psMetricRow(name: string, value: number | null, good: string, unit: "ms" | "s" | "raw") {
  const fmt = unit === "s" ? (v: number) => `${(v / 1000).toFixed(2)}s`
    : unit === "ms" ? (v: number) => `${Math.round(v)}ms`
    : (v: number) => v.toFixed(3);
  return { name, display: value !== null ? fmt(value) : "--", raw: value, good };
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

  // PageSpeed
  const [pageSpeed, setPageSpeed] = useState<PageSpeedData | null>(null);
  const [psLoading, setPsLoading] = useState(false);
  const [psRunning, setPsRunning] = useState(false);
  const [psError, setPsError] = useState<string | null>(null);

  // GSC
  const [gsc, setGsc] = useState<GSCStatus | null>(null);
  const [gscLoading, setGscLoading] = useState(false);
  const [gscSyncing, setGscSyncing] = useState(false);

  // Audit
  const [audit, setAudit] = useState<AuditData | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditResult, setAuditResult] = useState<{ issuesFound: number; issuesFixed: number } | null>(null);

  // Reports
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  // Keyword Intelligence
  const [clusters, setClusters] = useState<KeywordCluster[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [kwIntelLoading, setKwIntelLoading] = useState(false);
  const [clusteringLoading, setClusteringLoading] = useState(false);
  const [blogGenLoading, setBlogGenLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [seedKeyword, setSeedKeyword] = useState("");
  const [selectedKeywordId, setSelectedKeywordId] = useState<string | null>(null);
  const [blogGenMode, setBlogGenMode] = useState<"outline" | "full">("outline");
  const [kwView, setKwView] = useState<"clusters" | "gap" | "blog" | "suggest">("clusters");
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [savingPost, setSavingPost] = useState(false);

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

  const fetchGSC = useCallback(async () => {
    setGscLoading(true);
    try {
      const res = await fetch("/api/seo/gsc/status");
      if (res.ok) setGsc(await res.json());
    } catch {
      // noop
    } finally {
      setGscLoading(false);
    }
  }, []);

  const syncGSC = useCallback(async () => {
    setGscSyncing(true);
    try {
      await fetch("/api/seo/gsc/sync", { method: "POST" });
      await fetchGSC();
      fetchKeywords();
    } catch {
      // noop
    } finally {
      setGscSyncing(false);
    }
  }, [fetchGSC, fetchKeywords]);

  const fetchPageSpeed = useCallback(async () => {
    setPsLoading(true);
    setPsError(null);
    try {
      const res = await fetch("/api/seo/pagespeed");
      if (res.ok) setPageSpeed(await res.json());
    } catch {
      // noop
    } finally {
      setPsLoading(false);
    }
  }, []);

  const runPageSpeed = useCallback(async () => {
    setPsRunning(true);
    setPsError(null);
    try {
      const res = await fetch("/api/seo/pagespeed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "PageSpeed test failed");
      setPageSpeed(data);
    } catch (err) {
      setPsError(err instanceof Error ? err.message : "Test failed");
    } finally {
      setPsRunning(false);
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

  const fetchKwIntel = useCallback(async () => {
    setKwIntelLoading(true);
    try {
      const [clustersRes, blogsRes] = await Promise.all([
        fetch("/api/seo/clusters"),
        fetch("/api/seo/blog"),
      ]);
      if (clustersRes.ok) {
        const data = await clustersRes.json();
        setClusters(data.clusters || []);
      }
      if (blogsRes.ok) setBlogPosts(await blogsRes.json());
    } catch { /* noop */ }
    finally { setKwIntelLoading(false); }
  }, []);

  const runAutocluster = async () => {
    setClusteringLoading(true);
    try {
      const res = await fetch("/api/seo/keywords/cluster", { method: "POST" });
      if (res.ok) { await fetchKwIntel(); fetchKeywords(); }
    } catch { /* noop */ }
    finally { setClusteringLoading(false); }
  };

  const generateBlog = async () => {
    if (!selectedKeywordId) return;
    setBlogGenLoading(true);
    try {
      const res = await fetch("/api/seo/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", keyword_id: selectedKeywordId, mode: blogGenMode }),
      });
      if (res.ok) { await fetchKwIntel(); }
    } catch { /* noop */ }
    finally { setBlogGenLoading(false); }
  };

  const suggestKeywords = async () => {
    if (!seedKeyword.trim()) return;
    setSuggestLoading(true);
    try {
      const res = await fetch("/api/seo/keywords/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed_keyword: seedKeyword, existing_keywords: keywords.map(k => k.keyword) }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      }
    } catch { /* noop */ }
    finally { setSuggestLoading(false); }
  };

  const addSuggestedKeyword = async (kw: KeywordSuggestion) => {
    await fetch("/api/seo/keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: kw.keyword, category: kw.category, intent: kw.intent, search_volume: kw.est_volume }),
    });
    fetchKeywords();
  };

  useEffect(() => {
    fetchKeywords();
    fetchGSC();
  }, [fetchKeywords, fetchGSC]);

  // Handle ?gsc=connected after OAuth redirect
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("gsc") === "connected") {
      syncGSC();
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [syncGSC]);

  useEffect(() => {
    if (activeTab === "vitals" && !vitals) fetchVitals();
    if (activeTab === "vitals" && !pageSpeed) fetchPageSpeed();
    if (activeTab === "audit" && !audit) fetchAudit();
    if (activeTab === "reports" && reports.length === 0) fetchReports();
    if (activeTab === "intelligence" && clusters.length === 0) fetchKwIntel();
  }, [activeTab, vitals, pageSpeed, audit, reports.length, clusters.length, fetchVitals, fetchPageSpeed, fetchAudit, fetchReports, fetchKwIntel]);

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
      : null;
  const top10Count = keywords.filter((k) => k.current_rank && k.current_rank <= 10).length;

  // Derive site health label from latest audit
  const siteHealthScore = audit?.latest?.overall_score ?? null;
  const siteHealth =
    siteHealthScore === null ? "Unknown"
    : siteHealthScore >= 80 ? "Good"
    : siteHealthScore >= 60 ? "Fair"
    : "Needs Work";
  const siteHealthColor =
    siteHealthScore === null ? "text-slate-400"
    : siteHealthScore >= 80 ? "text-emerald-600"
    : siteHealthScore >= 60 ? "text-amber-500"
    : "text-red-500";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SEO Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track how patients find you online and how fast your site loads
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchKeywords();
            fetchGSC();
            if (activeTab === "vitals") { fetchVitals(); fetchPageSpeed(); }
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
          <TabsTrigger value="vitals">Speed & Vitals</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="intelligence">Keyword Intel</TabsTrigger>
        </TabsList>

        {/* ── Overview ──────────────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-6">

          {/* GSC connect banner — shown when not connected */}
          {!gscLoading && !gsc?.connected && (
            <Card className="border-blue-200 bg-blue-50/60">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Link2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Connect Google Search Console</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        See real clicks, impressions, and which searches bring patients to your site
                      </p>
                    </div>
                  </div>
                  <Button size="sm" asChild className="shrink-0">
                    <a href="/api/seo/gsc/connect">Connect Google</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* GSC connected — sync button + last-fetch note */}
          {gsc?.connected && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                Google Search Console connected
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={syncGSC}
                disabled={gscSyncing}
                className="gap-1.5 text-xs h-7"
              >
                {gscSyncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                {gscSyncing ? "Syncing…" : "Sync GSC"}
              </Button>
            </div>
          )}

          {/* Metric cards — GSC-powered when connected, keyword-based fallback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gsc?.connected && gsc.summary ? (
              <>
                <Card className="border-l-4 border-l-cyan-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                        <Eye className="h-6 w-6 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {gsc.summary.impressions.toLocaleString()}
                        </p>
                        <p className="text-sm font-medium text-slate-700 mt-0.5">Times shown in Google</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Your practice appeared in search results {gsc.summary.impressions.toLocaleString()} times in the last 28 days
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <MousePointerClick className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {gsc.summary.clicks.toLocaleString()}
                        </p>
                        <p className="text-sm font-medium text-slate-700 mt-0.5">Patients clicked to your site</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {(gsc.summary.ctr * 100).toFixed(1)}% of people who saw you clicked — last 28 days
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          #{gsc.summary.position.toFixed(1)}
                        </p>
                        <p className="text-sm font-medium text-slate-700 mt-0.5">Average Google position</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {gsc.summary.position <= 10
                            ? "You appear on page 1 on average — great visibility"
                            : gsc.summary.position <= 20
                            ? "You appear on page 1-2 — room to climb"
                            : "You appear beyond page 2 — content work will help"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-violet-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                        <Activity className="h-6 w-6 text-violet-600" />
                      </div>
                      <div>
                        <p className={`text-2xl font-bold ${siteHealthColor}`}>{siteHealth}</p>
                        <p className="text-sm font-medium text-slate-700 mt-0.5">Site health</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {siteHealthScore !== null
                            ? `Based on your last SEO audit — score: ${siteHealthScore}/100`
                            : "Run an audit in the Audit tab to see your score"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="border-l-4 border-l-cyan-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                        <Search className="h-6 w-6 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{keywords.length}</p>
                        <p className="text-sm font-medium text-slate-700 mt-0.5">
                          {keywords.length === 1 ? "Search phrase tracked" : "Search phrases tracked"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {keywords.length === 0
                            ? "Add keywords below to start monitoring rankings"
                            : `We watch ${keywords.length} terms to see where you appear in Google`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{avgRank ? `#${avgRank}` : "--"}</p>
                        <p className="text-sm font-medium text-slate-700 mt-0.5">Average Google position</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {avgRank
                            ? `Your practice appears around position ${avgRank} on average`
                            : "Connect Google Search Console for real data"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{top10Count}</p>
                        <p className="text-sm font-medium text-slate-700 mt-0.5">Keywords on page 1</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {top10Count === 0
                            ? "No keywords in top 10 yet — keep building!"
                            : `${top10Count} ${top10Count === 1 ? "term" : "terms"} where patients can find you on page 1`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-violet-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                        <Activity className="h-6 w-6 text-violet-600" />
                      </div>
                      <div>
                        <p className={`text-2xl font-bold ${siteHealthColor}`}>{siteHealth}</p>
                        <p className="text-sm font-medium text-slate-700 mt-0.5">Site health</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {siteHealthScore !== null
                            ? `Based on your last SEO audit — score: ${siteHealthScore}/100`
                            : "Run an audit in the Audit tab to see your score"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* GSC Top Queries table */}
          {gsc?.connected && gsc.topQueries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What patients searched to find you</CardTitle>
                <CardDescription>Top searches from Google — last 28 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-2 font-medium text-slate-500">Search term</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">Clicks</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">Shown</th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gsc.topQueries.map((q) => (
                        <tr key={q.query} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-2 text-slate-800 font-medium">{q.query}</td>
                          <td className="py-3 px-2 text-center font-semibold text-emerald-600">{q.clicks}</td>
                          <td className="py-3 px-2 text-center text-slate-500">{q.impressions.toLocaleString()}</td>
                          <td className="py-3 px-2 text-center">
                            <span className={`font-mono text-sm ${q.position <= 10 ? "text-emerald-600" : q.position <= 20 ? "text-amber-500" : "text-slate-400"}`}>
                              #{q.position.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
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
                <CardTitle className="text-base">Tracked Keywords</CardTitle>
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

        {/* ── Speed & Vitals ─────────────────────────────────────────────────── */}
        <TabsContent value="vitals" className="space-y-6">

          {/* PageSpeed Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-cyan-600" />
                    PageSpeed Score
                  </CardTitle>
                  <CardDescription>
                    How fast your site loads — tested by Google&apos;s PageSpeed Insights
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={runPageSpeed}
                  disabled={psRunning}
                  className="gap-2 shrink-0"
                >
                  {psRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  {psRunning ? "Testing…" : "Run Test"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {psLoading || psRunning ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                  <p className="text-sm text-slate-500">
                    {psRunning ? "Running PageSpeed test — this takes about 30 seconds…" : "Loading…"}
                  </p>
                </div>
              ) : psError ? (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {psError}
                </div>
              ) : pageSpeed?.mobile || pageSpeed?.desktop ? (
                <>
                  {/* Side-by-side gauges */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        <Smartphone className="h-4 w-4" />
                        Mobile
                      </div>
                      <PSGauge score={pageSpeed.mobile?.performance_score ?? null} label="Performance" />
                      <p className="text-xs text-slate-400 text-center">
                        {pageSpeed.mobile?.performance_score !== null && pageSpeed.mobile?.performance_score !== undefined
                          ? pageSpeed.mobile.performance_score >= 90
                            ? "Your site loads fast on phones"
                            : pageSpeed.mobile.performance_score >= 50
                            ? "Room to improve on mobile"
                            : "Slow on mobile — patients may leave"
                          : "No data"}
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        <Monitor className="h-4 w-4" />
                        Desktop
                      </div>
                      <PSGauge score={pageSpeed.desktop?.performance_score ?? null} label="Performance" />
                      <p className="text-xs text-slate-400 text-center">
                        {pageSpeed.desktop?.performance_score !== null && pageSpeed.desktop?.performance_score !== undefined
                          ? pageSpeed.desktop.performance_score >= 90
                            ? "Your site loads fast on computers"
                            : pageSpeed.desktop.performance_score >= 50
                            ? "Room to improve on desktop"
                            : "Slow on desktop — patients may leave"
                          : "No data"}
                      </p>
                    </div>
                  </div>

                  {/* Metric grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {(
                      [
                        { key: "lcp", label: "Page loads main content", unit: "s" as const, good: "< 2.5s" },
                        { key: "fcp", label: "First content appears", unit: "s" as const, good: "< 1.8s" },
                        { key: "ttfb", label: "Server responds", unit: "ms" as const, good: "< 800ms" },
                        { key: "cls", label: "Layout stays stable", unit: "raw" as const, good: "< 0.1" },
                      ] as const
                    ).map(({ key, label, unit, good }) => {
                      const mVal = pageSpeed.mobile?.[key] ?? null;
                      const dVal = pageSpeed.desktop?.[key] ?? null;
                      const fmt = (v: number | null) => {
                        if (v === null) return "--";
                        if (unit === "s") return `${(v / 1000).toFixed(2)}s`;
                        if (unit === "ms") return `${Math.round(v)}ms`;
                        return v.toFixed(3);
                      };
                      return (
                        <div key={key} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <p className="text-xs text-slate-500 mb-2">{label}</p>
                          <div className="flex items-baseline gap-2">
                            <div className="flex items-center gap-1">
                              <Smartphone className="h-3 w-3 text-slate-400" />
                              <span className="text-sm font-semibold text-slate-800">{fmt(mVal)}</span>
                            </div>
                            <span className="text-slate-300 text-xs">/</span>
                            <div className="flex items-center gap-1">
                              <Monitor className="h-3 w-3 text-slate-400" />
                              <span className="text-sm font-semibold text-slate-800">{fmt(dVal)}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">Target: {good}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Top opportunities */}
                  {(pageSpeed.mobile?.opportunities ?? []).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-3">Top speed improvements</p>
                      <div className="space-y-2">
                        {(pageSpeed.mobile?.opportunities ?? []).slice(0, 3).map((opp) => (
                          <div
                            key={opp.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100"
                          >
                            <p className="text-sm text-slate-700">{opp.title}</p>
                            <span className="text-xs font-medium text-amber-700 shrink-0 ml-3">
                              {opp.displayValue}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {pageSpeed.cached && pageSpeed.cachedAt && (
                    <p className="text-xs text-slate-400 mt-4">
                      Last tested {new Date(pageSpeed.cachedAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })} — cached for 24h. Click Run Test to refresh.
                    </p>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 py-10">
                  <Gauge className="h-12 w-12 text-slate-300" />
                  <div className="text-center">
                    <p className="text-slate-600 font-medium">No speed data yet</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Click &quot;Run Test&quot; to check how fast your site loads on mobile and desktop
                    </p>
                  </div>
                  <Button size="sm" onClick={runPageSpeed} disabled={psRunning} className="gap-2">
                    <Zap className="h-4 w-4" />
                    Run PageSpeed Test
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real User Vitals Section */}
          {vitalsLoading ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300 mx-auto" />
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-600" />
                    Real User Experience
                  </CardTitle>
                  <CardDescription>
                    Measured from actual visitors — collected automatically in the background
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(
                      [
                        {
                          name: "LCP",
                          label: "Page load speed",
                          description: "How long before your main content appears",
                          threshold: "Fast if under 2.5s",
                          icon: Clock,
                        },
                        {
                          name: "CLS",
                          label: "Layout stability",
                          description: "How much your page jumps around while loading",
                          threshold: "Stable if under 0.1",
                          icon: Activity,
                        },
                        {
                          name: "INP",
                          label: "Tap/click response",
                          description: "How fast buttons and links respond to a tap",
                          threshold: "Fast if under 200ms",
                          icon: Zap,
                        },
                      ] as const
                    ).map(({ name, label, description, threshold, icon: Icon }) => {
                      const value = vitals?.summary[name.toLowerCase() as "lcp" | "cls" | "inp"] ?? null;
                      const status = vitalStatus(name, value);
                      const samples = vitals?.summary.samples[name.toLowerCase() as "lcp" | "cls" | "inp"] ?? 0;
                      return (
                        <Card key={name} className="border border-slate-100 shadow-none">
                          <CardContent className="pt-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="h-10 w-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-cyan-600" />
                              </div>
                              <VitalBadge status={status} />
                            </div>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                              {formatVitalValue(name, value)}
                            </p>
                            <p className="text-sm font-medium text-slate-700 mt-0.5">{label}</p>
                            <p className="text-xs text-slate-400 mt-1">{description}</p>
                            <p className="text-xs text-slate-400 mt-2">
                              {threshold} · {samples} real visitor{samples !== 1 ? "s" : ""}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {vitals && vitals.byPage.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Per-Page Breakdown</CardTitle>
                    <CardDescription>p75 from real visitors — last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-2 font-medium text-slate-500">Page</th>
                            <th className="text-center py-3 px-2 font-medium text-slate-500">Load Speed</th>
                            <th className="text-center py-3 px-2 font-medium text-slate-500">Layout Shift</th>
                            <th className="text-center py-3 px-2 font-medium text-slate-500">Response</th>
                            <th className="text-center py-3 px-2 font-medium text-slate-500">Visitors</th>
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
              )}

              {(!vitals || vitals.byPage.length === 0) && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-10">
                      <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No visitor data yet</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Speed is measured automatically as real patients browse your site.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* ── Reports ───────────────────────────────────────────────────────── */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Monthly SEO Reports</CardTitle>
                  <CardDescription>
                    Auto-generated on the 1st of each month. Includes AI narrative summary.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={generatingReport}
                  onClick={async () => {
                    setGeneratingReport(true);
                    try {
                      const res = await fetch("/api/seo/reports/generate", { method: "POST" });
                      if (res.ok) {
                        await fetchReports();
                      }
                    } finally {
                      setGeneratingReport(false);
                    }
                  }}
                  className="gap-1.5 text-xs"
                >
                  {generatingReport ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  {generatingReport ? "Generating..." : "Generate Now"}
                </Button>
              </div>
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
                    Click &ldquo;Generate Now&rdquo; to create the first report, or wait for the 1st of next month.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {reports.map((r) => {
                    const monthDate = new Date(r.report_month + "T12:00:00Z");
                    const monthLabel = monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
                    const isExpanded = expandedReport === r.id;
                    return (
                      <div key={r.id} className="py-3">
                        <div className="flex items-center gap-3">
                          {/* Month + score */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-900">{monthLabel}</span>
                              {r.overall_score !== null && (
                                <span
                                  className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                                    r.overall_score >= 80
                                      ? "bg-emerald-50 text-emerald-700"
                                      : r.overall_score >= 60
                                      ? "bg-amber-50 text-amber-600"
                                      : "bg-red-50 text-red-600"
                                  }`}
                                >
                                  {r.overall_score}
                                </span>
                              )}
                              {r.sent_to_client && (
                                <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
                                  <Mail className="h-3 w-3" />
                                  Sent
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Generated {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            {r.narrative && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setExpandedReport(isExpanded ? null : r.id)}
                                className="h-7 gap-1 text-xs text-slate-500 hover:text-slate-900"
                              >
                                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                {isExpanded ? "Hide" : "Summary"}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/api/seo/reports/pdf?id=${r.id}`, "_blank")}
                              className="h-7 gap-1 text-xs"
                            >
                              <Download className="h-3.5 w-3.5" />
                              PDF
                            </Button>
                          </div>
                        </div>
                        {/* Narrative block */}
                        {isExpanded && r.narrative && (
                          <div className="mt-3 rounded-lg border border-cyan-100 bg-cyan-50/50 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
                              <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wide">AI Executive Summary</span>
                            </div>
                            <div className="space-y-2">
                              {r.narrative.split("\n\n").map((para, i) => (
                                <p key={i} className="text-sm text-slate-700 leading-relaxed">{para}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-cyan-100 bg-cyan-50/50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Monthly reports are sent automatically</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    On the 1st of each month, a report is generated with AI narrative, keyword rankings,
                    site health score, and emailed to the client.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Keyword Intelligence ───────────────────────────────────────────── */}
        <TabsContent value="intelligence" className="space-y-6">
          {/* Sub-nav */}
          <div className="flex gap-2 flex-wrap">
            {(["clusters", "gap", "blog", "suggest"] as const).map((key) => {
              const labels: Record<string, string> = { clusters: "Clusters", gap: "Content Gap", blog: "Blog Generator", suggest: "AI Suggest" };
              return (
                <Button key={key} variant={kwView === key ? "default" : "outline"} size="sm" onClick={() => setKwView(key)}>
                  {labels[key]}
                </Button>
              );
            })}
            <div className="ml-auto">
              <Button variant="outline" size="sm" onClick={runAutocluster} disabled={clusteringLoading} className="gap-2">
                {clusteringLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Auto-Cluster
              </Button>
            </div>
          </div>

          {kwIntelLoading && (
            <Card><CardContent className="pt-6 py-12 text-center"><Loader2 className="h-8 w-8 animate-spin text-slate-300 mx-auto" /></CardContent></Card>
          )}

          {!kwIntelLoading && kwView === "clusters" && (
            <>
              {clusters.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 py-12 text-center">
                    <BarChart2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No clusters yet</p>
                    <p className="text-sm text-slate-400 mt-1">Click Auto-Cluster to group keywords by topic using AI</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clusters.map((cluster) => {
                    const clusterKws = keywords.filter(k => k.cluster_id === cluster.id);
                    const ranked = clusterKws.filter(k => k.current_rank !== null);
                    const avgRankCluster = ranked.length
                      ? Math.round(ranked.reduce((s, k) => s + (k.current_rank ?? 0), 0) / ranked.length)
                      : null;
                    const mappedKwIds = new Set(blogPosts.map(b => b.primary_keyword_id).filter(Boolean));
                    const blogsInCluster = clusterKws.filter(k => mappedKwIds.has(k.id)).length;
                    const gapCount = clusterKws.length - blogsInCluster;
                    const top10Count = clusterKws.filter(k => k.current_rank && k.current_rank <= 10).length;
                    return (
                      <Card key={cluster.id} className="border-l-4" style={{ borderLeftColor: cluster.color }}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold">{cluster.name}</CardTitle>
                            <span className="text-xs text-slate-400">{clusterKws.length} keywords</span>
                          </div>
                          {/* Opportunity metrics row */}
                          <div className="flex gap-3 mt-1.5 flex-wrap">
                            {avgRankCluster && (
                              <span className="text-xs text-slate-500">Avg rank: <span className="font-semibold text-slate-700">#{avgRankCluster}</span></span>
                            )}
                            <span className="text-xs text-slate-500">Top 10: <span className="font-semibold text-emerald-600">{top10Count}</span></span>
                            {gapCount > 0 && (
                              <span className="text-xs text-amber-600 font-medium">{gapCount} content gap{gapCount > 1 ? "s" : ""}</span>
                            )}
                            {gapCount === 0 && clusterKws.length > 0 && (
                              <span className="text-xs text-emerald-600 font-medium">All covered ✓</span>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {clusterKws.map(kw => (
                              <span key={kw.id} className="text-xs px-2 py-1 rounded-full border flex items-center gap-1"
                                style={{ borderColor: cluster.color + "40", backgroundColor: cluster.color + "10" }}>
                                {kw.keyword}
                                {kw.current_rank && <span className="font-mono text-slate-500">#{kw.current_rank}</span>}
                              </span>
                            ))}
                          </div>
                          {gapCount > 0 && (
                            <button onClick={() => setKwView("gap")}
                              className="text-xs text-cyan-600 hover:text-cyan-800 font-medium">
                              → View {gapCount} content gap{gapCount > 1 ? "s" : ""} →
                            </button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">High-Value Service Keywords</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Prioritize these high-ticket services. Each needs a dedicated landing page + blog post with &ldquo;near me Las Vegas&rdquo; angle.
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {["dental implants Las Vegas", "porcelain veneers Summerlin", "dental crowns near me", "tooth restoration Las Vegas", "cosmetic dentist near me"].map(kw => (
                          <span key={kw} className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">{kw}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!kwIntelLoading && kwView === "gap" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content Gap Analysis</CardTitle>
                <CardDescription>Keywords with no blog post mapped &mdash; these are content opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                {keywords.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No keywords to analyze</p>
                ) : (() => {
                  const mappedIds = new Set(blogPosts.map(b => b.primary_keyword_id).filter(Boolean));
                  const gapKws = keywords.filter(k => !mappedIds.has(k.id));
                  return gapKws.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                      <p className="text-slate-600 font-medium">All keywords have content mapped!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-amber-600 font-medium mb-3">{gapKws.length} keywords need content</p>
                      {gapKws.map(kw => (
                        <div key={kw.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/30 transition-colors">
                          <div>
                            <span className="text-sm font-medium text-slate-900">{kw.keyword}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">{kw.category}</span>
                              {kw.search_volume && <span className="text-xs text-slate-400">{kw.search_volume.toLocaleString()}/mo</span>}
                              {kw.current_rank && <span className="text-xs font-mono text-slate-400">#{kw.current_rank}</span>}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7"
                            onClick={() => { setSelectedKeywordId(kw.id); setKwView("blog"); }}>
                            <FileText className="h-3 w-3" />Create Blog
                          </Button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {!kwIntelLoading && kwView === "blog" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Blog Post Generator</CardTitle>
                  <CardDescription>Generates SEO-optimized posts targeting Las Vegas patients with &ldquo;near me&rdquo; local signals.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Target Keyword</label>
                    <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={selectedKeywordId ?? ""} onChange={e => setSelectedKeywordId(e.target.value || null)}>
                      <option value="">Select a keyword...</option>
                      {keywords.map(kw => <option key={kw.id} value={kw.id}>{kw.keyword}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Generation Mode</label>
                    <div className="flex gap-2">
                      <Button variant={blogGenMode === "outline" ? "default" : "outline"} size="sm" onClick={() => setBlogGenMode("outline")}>Outline Only</Button>
                      <Button variant={blogGenMode === "full" ? "default" : "outline"} size="sm" onClick={() => setBlogGenMode("full")}>Full Post (1,200-1,800 words)</Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">Full mode produces publish-ready content with FAQ section and booking CTAs.</p>
                  </div>
                  <Button onClick={generateBlog} disabled={!selectedKeywordId || blogGenLoading} className="gap-2">
                    {blogGenLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {blogGenLoading ? "Generating…" : "Generate Blog Post"}
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Generated Blog Posts ({blogPosts.length})</CardTitle></CardHeader>
                <CardContent>
                  {blogPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400">No blog posts generated yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {blogPosts.map(post => (
                        <div key={post.id} className="rounded-lg border border-slate-200 overflow-hidden">
                          <div className="flex items-center justify-between py-3 px-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{post.title}</p>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${post.status === "published" ? "bg-emerald-100 text-emerald-700" : post.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                                  {post.status}
                                </span>
                                {post.ai_generated && <span className="text-xs px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded">AI</span>}
                                {post.word_count && <span className="text-xs text-slate-400">{post.word_count.toLocaleString()} words</span>}
                                {post.primary_keyword && <span className="text-xs text-slate-400 truncate">→ {post.primary_keyword.keyword}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <Button size="sm" variant="outline" className="text-xs h-7 gap-1"
                                onClick={() => {
                                  if (editingPost === post.id) { setEditingPost(null); return; }
                                  setEditingPost(post.id);
                                  setEditContent(post.content_body || post.content_outline || "");
                                }}>
                                {editingPost === post.id ? "Close" : "Edit"}
                              </Button>
                              {post.status === "draft" && (
                                <Button size="sm" variant="outline" className="text-xs h-7 gap-1"
                                  onClick={async () => {
                                    await fetch("/api/seo/blog", { method: "PUT", headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ id: post.id, status: "published", published_at: new Date().toISOString() }) });
                                    fetchKwIntel();
                                  }}>
                                  <CheckCircle2 className="h-3 w-3" />Publish
                                </Button>
                              )}
                              {post.status === "published" && (
                                <Button size="sm" variant="ghost" className="text-xs h-7" asChild>
                                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3" /></a>
                                </Button>
                              )}
                            </div>
                          </div>
                          {editingPost === post.id && (
                            <div className="border-t border-slate-200 p-3 bg-slate-50 space-y-3">
                              <textarea
                                className="w-full h-72 text-xs font-mono border border-slate-200 rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                placeholder="Markdown content..."
                              />
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="gap-1.5 text-xs" disabled={savingPost}
                                  onClick={async () => {
                                    setSavingPost(true);
                                    try {
                                      const field = post.content_body ? "content_body" : "content_outline";
                                      const wc = editContent.trim().split(/\s+/).length;
                                      await fetch("/api/seo/blog", { method: "PUT", headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ id: post.id, [field]: editContent, word_count: wc }) });
                                      setEditingPost(null);
                                      fetchKwIntel();
                                    } finally { setSavingPost(false); }
                                  }}>
                                  {savingPost ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                                  Save Changes
                                </Button>
                                <p className="text-xs text-slate-400">{editContent.trim().split(/\s+/).filter(Boolean).length} words · Markdown supported</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {!kwIntelLoading && kwView === "suggest" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI Keyword Suggestions</CardTitle>
                <CardDescription>Enter a seed term &mdash; AI generates Las Vegas-focused variations with &ldquo;near me&rdquo; angles and local intent.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <input type="text" value={seedKeyword} onChange={(e) => setSeedKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && suggestKeywords()}
                    placeholder='e.g. "dental implants" or "veneers"'
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                  <Button onClick={suggestKeywords} disabled={suggestLoading || !seedKeyword.trim()} size="sm" className="gap-2">
                    {suggestLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Suggest
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <p className="text-xs text-slate-500 w-full">Quick start &mdash; high-value services:</p>
                  {["dental implants", "porcelain veneers", "dental crowns", "tooth restoration", "cosmetic dentist", "Invisalign", "teeth whitening", "emergency dentist"].map(seed => (
                    <button key={seed} onClick={() => setSeedKeyword(seed)}
                      className="text-xs px-2.5 py-1 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition-colors">
                      {seed}
                    </button>
                  ))}
                </div>
                {suggestions.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-sm font-medium text-slate-700">{suggestions.length} suggestions</p>
                    {suggestions.map((sug, i) => (
                      <div key={i} className="flex items-start justify-between gap-3 py-2.5 px-3 rounded-lg border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/30 transition-colors">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900">{sug.keyword}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">{sug.category}</span>
                            <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{sug.intent}</span>
                            {sug.est_volume > 0 && <span className="text-xs text-slate-400">{sug.est_volume.toLocaleString()}/mo</span>}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{sug.rationale}</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs h-7 gap-1 shrink-0" onClick={() => addSuggestedKeyword(sug)}>
                          <Plus className="h-3 w-3" />Add
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
