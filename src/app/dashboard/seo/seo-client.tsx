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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

function RankChange({ current, previous }: { current: number | null; previous: number | null }) {
  if (!current || !previous) return <Minus className="h-4 w-4 text-slate-400" />;
  const diff = previous - current;
  if (diff > 0) return <span className="flex items-center text-emerald-600 text-sm font-medium"><TrendingUp className="h-3.5 w-3.5 mr-1" />+{diff}</span>;
  if (diff < 0) return <span className="flex items-center text-red-500 text-sm font-medium"><TrendingDown className="h-3.5 w-3.5 mr-1" />{diff}</span>;
  return <Minus className="h-4 w-4 text-slate-400" />;
}

export function SEODashboardClient() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [newKeyword, setNewKeyword] = useState("");
  const [addingKeyword, setAddingKeyword] = useState(false);

  const fetchKeywords = useCallback(async () => {
    try {
      const res = await fetch("/api/seo/keywords");
      if (res.ok) {
        const data = await res.json();
        setKeywords(data);
      }
    } catch {
      // Keywords table may not exist yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

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
      // Handle error
    } finally {
      setAddingKeyword(false);
    }
  };

  const rankedKeywords = keywords.filter((k) => k.current_rank);
  const avgRank =
    rankedKeywords.length > 0
      ? (
          rankedKeywords.reduce((sum, k) => sum + (k.current_rank || 0), 0) /
          rankedKeywords.length
        ).toFixed(1)
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
          onClick={fetchKeywords}
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

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Tracked Keywords</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {keywords.length}
                    </p>
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
                    <p className="text-3xl font-bold text-slate-900">
                      {avgRank}
                    </p>
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

          {/* Top Keywords */}
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
                        <span className="font-medium text-slate-900">
                          {kw.keyword}
                        </span>
                        <span className="ml-2 text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">
                          {kw.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-slate-600">
                          {kw.current_rank ? `#${kw.current_rank}` : "--"}
                        </span>
                        <RankChange
                          current={kw.current_rank}
                          previous={kw.previous_rank}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-6">
          {/* Add Keyword */}
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
                <Button
                  onClick={addKeyword}
                  disabled={addingKeyword || !newKeyword.trim()}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Keywords Table */}
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  Loading keywords...
                </p>
              ) : keywords.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No keywords tracked yet</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Add keywords above to start tracking rankings
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-2 font-medium text-slate-500">
                          Keyword
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-slate-500">
                          Category
                        </th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">
                          Rank
                        </th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">
                          Change
                        </th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">
                          Best
                        </th>
                        <th className="text-center py-3 px-2 font-medium text-slate-500">
                          Volume
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywords.map((kw) => (
                        <tr
                          key={kw.id}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >
                          <td className="py-3 px-2 font-medium text-slate-900">
                            {kw.keyword}
                          </td>
                          <td className="py-3 px-2">
                            <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">
                              {kw.category}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center font-mono">
                            {kw.current_rank ? `#${kw.current_rank}` : "--"}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <RankChange
                              current={kw.current_rank}
                              previous={kw.previous_rank}
                            />
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

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SEO Audit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  Run an audit to check for SEO issues
                </p>
                <p className="text-sm text-slate-400 mt-1 mb-6">
                  Checks canonical tags, meta descriptions, schema markup, and
                  more
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="/api/cron/seo-auto-fix"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Run Audit Now
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vitals Tab */}
        <TabsContent value="vitals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "LCP",
                label: "Largest Contentful Paint",
                threshold: "< 2.5s",
                color: "text-emerald-600",
              },
              {
                name: "CLS",
                label: "Cumulative Layout Shift",
                threshold: "< 0.1",
                color: "text-emerald-600",
              },
              {
                name: "INP",
                label: "Interaction to Next Paint",
                threshold: "< 200ms",
                color: "text-emerald-600",
              },
            ].map((vital) => (
              <Card key={vital.name}>
                <CardContent className="pt-6">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    {vital.name}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">--</p>
                  <p className="text-xs text-slate-400 mt-1">{vital.label}</p>
                  <p className={`text-xs mt-2 ${vital.color}`}>
                    Target: {vital.threshold}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  Web Vitals data will appear here as users visit your site
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Real user metrics are collected automatically via the Web
                  Vitals reporter
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">
                  Monthly SEO reports will appear here
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Reports are generated automatically on the 1st of each month
                  and sent to the client
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
