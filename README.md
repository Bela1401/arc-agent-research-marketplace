# Arc Agent Research Marketplace

Hackathon repository for the `Agent-to-Agent Research Marketplace` project on Arc, upgraded into a judge-ready product surface with live Arc runs, Circle wallet operations, browser-triggered jobs, and a premium x402 monetization layer.

## What this project demonstrates

- A `Manager Agent` decomposes a research request into paid microtasks
- `Research`, `Fact-check`, and `Summary` agents execute specialized work
- Each task is priced in `USDC` and designed for cheap settlement on `Arc Testnet`
- The UI highlights recent live jobs, transaction volume, premium resale, and unit economics for judges

## Live demo surfaces

- Homepage with recent real Arc runs, tx links, budgets, timestamps, and explorer-ready proof
- Judge mode at `/judges` with a one-click autopilot demo flow
- Submission kit at `/submission` with copy-ready hackathon text, video order, and checklist
- Browser launcher at `/launch` for live job creation from the UI or a direct URL
- Premium teaser and paywall endpoints at `/api/reports/teaser` and `/api/reports/premium`

The current demo environment has already crossed the `50+` transaction target required by the hackathon. The homepage intentionally shows the latest visible slice of that activity instead of flooding the UI with every historical transaction.

## Why this fits the hackathon

- Natural `agent-to-agent` payment loop
- Real repeated job flow that already scales into `50+` onchain transactions
- Clear `per-action pricing <= $0.01`
- Strong story for `Arc + USDC + x402 + agentic economy`

## Quick start

1. Install Node.js `20+`
2. Copy `.env.example` to `.env.local`
3. Install dependencies with `npm install`
4. Run the app with `npm run dev`

## Run the real Arc flow

1. Create a Circle standard API key
2. Register the Circle entity secret through the Circle console/configurator
3. Set `ARC_ADMIN_API_TOKEN` for any deployed environment that exposes the `app/api/arc/*` routes
4. Run `npm run arc:bootstrap`
5. Fund the validator and client wallets from the Circle faucet
6. Run `npm run arc:register-agents`
7. Run:
   - `npm run arc:run-job research`
   - `npm run arc:run-job factCheck`
   - `npm run arc:run-job summary`

## Browser-triggered jobs

For hackathon demos, you can run a new job directly from the browser in two ways:

1. Open `/launch` and submit the form
2. Open a direct URL like:
   `/api/arc/run-job?providerRole=research&description=Your+prompt&token=YOUR_TOKEN&format=html`

Important:

- the direct URL flow requires `ARC_ADMIN_API_TOKEN`
- query-string tokens are less secure than headers and should only be used for demos/internal ops

## What is real today

- Real: Circle wallet bootstrapping, Arc agent registration, ERC-8183 job settlement, recent-run recovery from Arc logs, premium report teaser and paywall, and browser-triggered live job creation
- Presentation-oriented: some explanatory panels are still crafted to help judges understand the flow quickly, but the core marketplace proof and recent-run surfaces are live-backed

## Suggested next implementation steps

1. Persist completed jobs and reports into a durable store instead of deriving the UI from chain plus proof artifacts alone
2. Add live LLM execution for specialist outputs and attach each deliverable to the premium resale flow
3. Add richer explorer analytics and provider-level reputation history
4. Turn the submission kit into a reusable founder-mode launch flow after the hackathon

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
- token-protected mutation routes for safer cloud deployment
- x402-compatible premium report monetization
- recent-run recovery directly from live Arc contract logs

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

## Submission flow

For the final hackathon handoff, use:

1. `/judges` for the live demo flow
2. `/submission` for copy-ready submission text, cover-image direction, slide outline, and the video script
3. the homepage for recent live jobs, tx links, premium access, and economics proof
