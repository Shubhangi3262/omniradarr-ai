# Insight Agent

OmniRadar AI is an autonomous multi-agent intelligence platform built on LangGraph, designed to continuously research and monitor any domain — technical, competitive, or scientific — and turn scattered signals into a single decision-ready briefing.

At its core is an orchestrated agent graph, not a single chatbot: a planner breaks down a monitoring objective into specialist tasks across five signal categories (research, patents, news, competitors, social); parallel specialist agents investigate each lane using a three-tier tool fallback chain (live retrieval → degraded retrieval → memory-only archive recall), so individual failures degrade gracefully instead of crashing the run; a reconciliation stage adjudicates contradictory evidence between sources rather than averaging it away; a verifier proposes falsifiable hypotheses and tests them strictly against the gathered evidence; and a critic self-evaluates confidence, coverage, and gaps, triggering autonomous replanning when the answer isn't good enough — with loop and deadlock detection so it can't spin forever.

The system maintains both short-term (per-run) and long-term (cross-run) memory digests for continuity between sweeps, tracks a hard execution budget with model-fallback chains (across multiple LLMs) and retry/backoff logic, and includes a built-in chaos-testing mode that can inject simulated tool outages and conflicting evidence to demonstrate resilience under adversarial conditions. Every run produces a full execution trace, a plan, resolved conflicts, tested hypotheses, per-lane reports, and a final structured briefing — headline, signals, competitor moves, opportunities, risks, and recommended actions — all exposed through a modern React/TanStack Start interface

This project was built with [Single Scope](https://lovable.dev).

**Live app**: https://omniradar-ai.lovable.app

## Build with Single Scope

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/90d931a5-57de-4140-84b5-c5d1eea92131).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
