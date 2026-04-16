# Arc Agent Research Marketplace

Hackathon repository for the `Agent-to-Agent Research Marketplace` project on Arc, now upgraded with real Circle wallet setup, real Arc agent registration, and real ERC-8183 job executions.

## What this project demonstrates

- A `Manager Agent` decomposes a research request into paid microtasks
- `Research`, `Fact-check`, and `Summary` agents execute specialized work
- Each task is priced in `USDC` and designed for cheap settlement on `Arc Testnet`
- The UI highlights task progress, transaction volume, and unit economics for judges

## Live testnet proof

Successful run completed on `2026-04-16`:

- `5` Circle Developer-Controlled Wallets created for the marketplace flow
- `3` provider agents registered on Arc
- `3` real jobs completed on Arc via `ERC-8183`
- `21` ERC-8183 lifecycle transactions captured across those jobs

Completed jobs:

- `research` job `#3437`
- `factCheck` job `#3438`
- `summary` job `#3439`

The homepage now includes a `Live Arc proof` section with real wallet addresses, real job IDs, and explorer links from the successful run.

## Why this fits the hackathon

- Natural `agent-to-agent` payment loop
- Easy to reach `50+` onchain transactions in a realistic workflow
- Clear `per-action pricing <= $0.01`
- Strong story for `Arc + USDC + agentic economy`

## Quick start

1. Install Node.js `20+`
2. Copy `.env.example` to `.env.local`
3. Install dependencies with `npm install`
4. Run the app with `npm run dev`

## Run the real Arc flow

1. Create a Circle standard API key
2. Register the Circle entity secret through the Circle console/configurator
3. Run `npm run arc:bootstrap`
4. Fund the validator and client wallets from the Circle faucet
5. Run `npm run arc:register-agents`
6. Run:
   - `npm run arc:run-job research`
   - `npm run arc:run-job factCheck`
   - `npm run arc:run-job summary`

## What is real vs mocked today

- Real: Circle wallet bootstrapping, Arc agent registration, ERC-8183 job settlement, live proof panel
- Mocked for presentation polish: the research brief board, sample task list, and synthetic transaction feed lower on the page

## Suggested next implementation steps

1. Replace the remaining mocked dashboard data in `lib/mock-data.ts` with persisted job records
2. Store agent registration outputs and tx hashes in a database or JSON artifact
3. Add live LLM execution for specialist reports and display the output in the UI
4. Run repeated jobs to exceed the `50+` transaction showcase target for judging

## Repo structure

- `app/` Next.js app router pages and API routes
- `components/` dashboard and presentation components
- `lib/` shared types, Arc config, economics, Circle helpers, and Arc integration logic
- `docs/` tech spec, architecture, implementation plan, and demo script
- `scripts/` runnable Arc setup and execution scripts

## Real Arc integration

The repo now includes working integration-ready flows for:

- wallet bootstrapping via Circle Developer-Controlled Wallets
- agent registration and validation on `ERC-8004`
- job creation and settlement on `ERC-8183`

Use these commands after filling `.env.local`:

1. `npm run arc:bootstrap`
2. fund the validator and client wallets from the Circle faucet
3. `npm run arc:register-agents`
4. `npm run arc:run-job research`
5. `npm run arc:run-job factCheck`
6. `npm run arc:run-job summary`

## Key docs

- [Tech Spec](./docs/TECH_SPEC.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)
- [Demo Script](./docs/DEMO_SCRIPT.md)
- [Submission Description](./docs/SUBMISSION_DESCRIPTION.md)
- [Submission Checklist](./docs/SUBMISSION_CHECKLIST.md)
- [Arc Integration Guide](./docs/ARC_INTEGRATION.md)
- [Live Run Guide](./docs/LIVE_RUN_GUIDE.md)
