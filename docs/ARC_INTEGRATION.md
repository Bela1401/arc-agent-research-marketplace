# Arc Integration Guide

## What is implemented

- `ERC-8004` agent registration, reputation feedback, and validation flow
- `ERC-8183` job creation, budgeting, funding, submission, and completion
- Circle Developer-Controlled Wallet setup for Arc Testnet
- Next.js API routes for local automation and demo tooling
- a homepage `Live Arc proof` section that surfaces successful real testnet runs

## Environment setup

Copy `.env.example` to `.env.local` and set:

- `CIRCLE_API_KEY`
- `CIRCLE_ENTITY_SECRET`
- wallet addresses after bootstrapping
- metadata URIs for each marketplace agent

## Bootstrapping wallets

Run:

```bash
npm run arc:bootstrap
```

This creates five Arc Testnet wallets:

- validator
- client
- research provider
- fact-check provider
- summary provider

Then fund at least the validator and client from the Circle Faucet. The job script can transfer starter USDC from the client to a provider wallet automatically.

## Register marketplace agents

Run:

```bash
npm run arc:register-agents
```

Optional role-specific registration:

```bash
npm run arc:register-agents research
npm run arc:register-agents factCheck
```

This script:

1. registers each provider wallet on the Arc `IdentityRegistry`
2. records validator feedback on the `ReputationRegistry`
3. requests and completes validation on the `ValidationRegistry`

## Execute a real ERC-8183 job

Run:

```bash
npm run arc:run-job research
```

Or provide a custom description:

```bash
npm run arc:run-job summary "Summarize the market gaps in Arc-native agent commerce"
```

This script:

1. optionally transfers starter USDC from client to provider
2. creates a job on `AgenticCommerce`
3. sets the job budget
4. approves USDC
5. funds escrow
6. submits the deliverable hash
7. completes the job

## Proven live run in this repo

Completed on `2026-04-16`:

- wallet set `a0c3f6a3-512e-5b7a-955a-257c73506066`
- `research` job `#3437`
- `factCheck` job `#3438`
- `summary` job `#3439`

Those runs are now reflected in the UI and docs so judges can immediately see that the repo has already executed real Arc flows.

## API routes

- `GET /api/arc/status`
- `POST /api/arc/bootstrap`
- `POST /api/arc/register-agents`
- `POST /api/arc/run-job`

## Important limitations

- Real execution requires valid Circle credentials and funded Arc Testnet wallets
- The app UI still mixes polished mock workflow sections with real proof data
- Repeated agent registration creates new identity NFTs unless you add persistence
- The current job flow demonstrates one provider role per run; multi-agent batching is the next step
