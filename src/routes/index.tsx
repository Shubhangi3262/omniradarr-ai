import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Brain,
  Database,
  FileText,
  Flag,
  History,
  Lightbulb,
  Loader2,
  Newspaper,
  Radar,
  Rocket,
  Scale,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";

import { runIntelAgent, type IntelBriefing } from "@/lib/intel.functions";
import {
  buildMemoryContext,
  clearMemory,
  forgetEntry,
  loadMemory,
  rememberBriefing,
  type MemoryEntry,
} from "@/lib/memory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SignalScope — Autonomous Research & Competitor Intelligence Agent" },
      {
        name: "description",
        content:
          "An autonomous AI agent that tracks research, patents, news and competitor moves, then delivers concise, actionable intelligence briefings.",
      },
      { property: "og:title", content: "SignalScope — Autonomous Intelligence Agent" },
      {
        property: "og:description",
        content:
          "Track publications, patents, news and rivals in one run. Get decision-ready insights in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SOURCES = [
  { id: "publications", label: "Publications", icon: FileText },
  { id: "patents", label: "Patents", icon: Scale },
  { id: "news", label: "Industry news", icon: Newspaper },
  { id: "competitors", label: "Competitor moves", icon: Users },
  { id: "social", label: "Social chatter", icon: Activity },
];

const CATEGORY_ICON = {
  research: FileText,
  patent: Scale,
  news: Newspaper,
  competitor: Users,
  social: Activity,
} as const;

function Index() {
  const [topic, setTopic] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [focus, setFocus] = useState<string[]>(["publications", "patents", "news"]);
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [useMemory, setUseMemory] = useState(true);

  useEffect(() => {
    setMemory(loadMemory());
  }, []);

  const run = useServerFn(runIntelAgent);
  const mutation = useMutation<IntelBriefing, Error, void>({
    mutationFn: () =>
      run({
        data: {
          topic,
          competitors,
          focus,
          ...(useMemory ? { memory: buildMemoryContext(memory, topic) } : {}),
        },
      }),
    onSuccess: (data) => setMemory(rememberBriefing({ topic, competitors }, data)),
  });

  const toggle = (id: string) =>
    setFocus((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const briefing = mutation.data;
  const recall = buildMemoryContext(memory, topic);

  return (
    <main className="min-h-screen bg-background bg-hero-grid">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <header className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Radar className="size-3.5 text-primary" />
            Autonomous monitoring agent
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="text-gradient-intel">SignalScope</span> watches your field
            so you don&apos;t have to.
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Point the agent at a domain. It sweeps research, patents, news, competitor
            strategy and social signals, then returns one concise, actionable briefing.
          </p>
        </header>

        <Card className="mt-10 border-border bg-card/70 panel-shadow backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="size-5 text-primary" /> Monitoring brief
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="topic">Domain or technology to track</Label>
              <Input
                id="topic"
                placeholder="e.g. solid-state battery electrolytes"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="competitors">Competitors (optional, comma separated)</Label>
              <Input
                id="competitors"
                placeholder="e.g. QuantumScape, Toyota, CATL"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Source priorities</Label>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map((s) => {
                  const active = focus.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggle(s.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <s.icon className="size-3.5" />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Agent memory</Label>
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
                <button
                  type="button"
                  onClick={() => setUseMemory((v) => !v)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    useMemory
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Brain className="size-3.5" />
                  {useMemory ? "Memory on" : "Memory off"}
                </button>
                <span className="text-muted-foreground">
                  {recall.shortTerm.length} short-term ·{" "}
                  {recall.longTerm.length} long-term recalled for this domain
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                disabled={topic.trim().length < 2 || mutation.isPending}
                onClick={() => mutation.mutate()}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Agent sweeping sources…
                  </>
                ) : (
                  <>
                    <Radar className="size-4" />{" "}
                    {recall.shortTerm.length ? "Run follow-up sweep" : "Run intelligence sweep"}
                  </>
                )}
              </Button>
              {mutation.isError && (
                <p className="text-sm text-destructive">{mutation.error.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {mutation.isPending && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-xl" />
            ))}
          </div>
        )}

        {!!memory.length && (
          <Card className="mt-8 border-border bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="size-4 text-primary" /> Memory store ({memory.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMemory(clearMemory())}
                className="text-muted-foreground"
              >
                <Trash2 className="size-4" /> Clear all
              </Button>
            </CardHeader>
            <CardContent className="grid gap-2">
              {memory.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2"
                >
                  <History className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => {
                      setTopic(m.topic);
                      setCompetitors(m.competitors ?? "");
                    }}
                    className="flex-1 text-left"
                  >
                    <p className="text-sm font-medium">{m.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(m.ts).toLocaleString()} — {m.headline}
                    </p>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Forget entry"
                    onClick={() => setMemory(forgetEntry(m.id))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {briefing && (
          <section className="mt-12 space-y-8">
            <Card className="border-primary/30 bg-card/70 panel-shadow">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {briefing.headline}
                </h2>
                <p className="mt-3 text-muted-foreground">{briefing.summary}</p>
                {briefing.continuity && (
                  <p className="mt-4 flex gap-2 rounded-lg border border-primary/25 bg-primary/10 p-3 text-sm text-foreground">
                    <Brain className="mt-0.5 size-4 shrink-0 text-primary" />
                    {briefing.continuity}
                  </p>
                )}
              </CardContent>
            </Card>


            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Detected signals
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {briefing.signals?.map((s, i) => {
                  const Icon = CATEGORY_ICON[s.category] ?? Activity;
                  return (
                    <Card key={i} className="border-border bg-card/60">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-primary">
                            <Icon className="size-4" />
                            {s.category}
                          </div>
                          <div className="flex items-center gap-2">
                            {s.is_new && (
                              <Badge variant="outline" className="gap-1 border-accent text-accent">
                                <Sparkles className="size-3" /> new
                              </Badge>
                            )}
                            <Badge
                              variant={s.impact === "high" ? "default" : "secondary"}
                              className="capitalize"
                            >
                              {s.impact} impact
                            </Badge>
                          </div>
                        </div>
                        <p className="mt-3 font-medium">{s.title}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{s.insight}</p>
                        <p className="mt-3 text-xs text-muted-foreground/80">
                          Verify via {s.source_hint}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {!!briefing.competitor_moves?.length && (
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Competitor moves
                </h3>
                <div className="grid gap-3">
                  {briefing.competitor_moves.map((c, i) => (
                    <Card key={i} className="border-border bg-card/60">
                      <CardContent className="flex flex-col gap-1 pt-5 sm:flex-row sm:items-start sm:gap-6">
                        <p className="w-40 shrink-0 font-medium text-accent">{c.name}</p>
                        <div>
                          <p className="text-sm">{c.move}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {c.implication}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <ListCard
                title="Opportunities"
                icon={Lightbulb}
                items={briefing.opportunities}
              />
              <ListCard title="Risks" icon={AlertTriangle} items={briefing.risks} />
              <ListCard
                title="Recommended actions"
                icon={Rocket}
                items={briefing.recommended_actions}
              />
            </div>
          </section>
        )}

        {!briefing && !mutation.isPending && (
          <p className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
            <Flag className="size-4" /> Tip: name the specific sub-field — sharper briefs
            produce sharper intelligence.
          </p>
        )}
      </div>
    </main>
  );
}

function ListCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof Lightbulb;
  items?: string[];
}) {
  return (
    <Card className="border-border bg-card/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="size-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {items?.map((it, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              {it}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
