# Opium Platform Improvement Plan

## Goal
Make Opium production-grade across reliability, growth, trust/safety, and creator monetization.

## Phase 1 (Next 7 Days) — Stability First
- Harden all user-input queries (search, filters, messaging lookups).
- Add end-to-end smoke checks for critical paths: auth, home feed, create, inbox, profile.
- Enforce quality gates in CI: lint + test + build.
- Add fail-safe UI states for loading, empty, and error on every primary page.

Success metrics:
- 0 critical runtime errors in core routes.
- 95%+ successful session starts (login to feed load).
- <2s median first feed response.

## Phase 2 (Next 2–3 Weeks) — Feed Quality + Retention
- Add ranking observability: log score components (recency, affinity, follow, interest) per request.
- A/B test weight sets and monitor watch time, completion, and return rate.
- Improve cold-start recommendations for new users with onboarding + topic seeds.
- Add anti-repeat controls (author and content diversity).

Success metrics:
- +15% watch time per session.
- +10% D1 retention for new users.
- Reduced repetitive content complaints.

## Phase 3 (Next Month) — Creator & Community
- Improve moderation tooling with action queues and response SLAs.
- Build creator dashboard quality upgrades: trend insights, best posting windows, audience segments.
- Improve monetization conversion surfaces (tier prompts, creator profile CTAs, transparent earnings).
- Launch notification quality rules (rate limits + personalization) to avoid spam fatigue.

Success metrics:
- +20% creator post frequency.
- +10% conversion to follows/subscriptions.
- <24h moderation response SLA.

## Ongoing Platform Standards
- Security: RLS-first schema changes, input sanitization, least-privilege service roles.
- Performance: measure before/after every feed/ranking change.
- Reliability: canary migrations and rollback-ready SQL strategy.
- Product quality: every new feature ships with tracking events and success metric ownership.

## Immediate Next Actions
1. Finish query hardening for all remaining `.or(...)` and raw-like filters.
2. Add CI workflow for `npm run lint`, `npm run test`, `npm run build`.
3. Add ranking telemetry table + lightweight inserts for score components.
4. Run UX polish pass on Home/Discover/Inbox consistency.
