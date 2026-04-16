# Live Run Guide

## Goal

This guide walks through the first real run of the Arc hackathon project using:

- Circle Developer-Controlled Wallets
- Arc Testnet
- `ERC-8004` agent registration
- `ERC-8183` job settlement

## Current proven run

This repo already has one successful baseline run completed on `2026-04-16`:

- wallet set `a0c3f6a3-512e-5b7a-955a-257c73506066`
- `research` job `#3437`
- `factCheck` job `#3438`
- `summary` job `#3439`

Use that as the reference shape for future reruns.

## Before you start

Make sure you have:

- a Circle Developer Console account
- a standard API key
- a registered entity secret
- Node.js installed
- the project dependencies already installed

## Step 1. Fill credentials

Open `.env.local` and replace:

- `CIRCLE_API_KEY`

For `CIRCLE_ENTITY_SECRET`, use this flow:

1. run `npm run circle:entity-secret:generate`
2. copy the printed secret
3. paste it into `.env.local` as `CIRCLE_ENTITY_SECRET`
4. run `npm run circle:entity-secret:register`

You can leave wallet addresses empty for now.

## Step 2. Create wallets

Run:

```bash
npm run arc:bootstrap
```

This creates five wallets:

- validator
- client
- research provider
- fact-check provider
- summary provider

The script prints a block of environment variables.

Copy those addresses into `.env.local`:

- `ARC_VALIDATOR_WALLET_ADDRESS`
- `ARC_CLIENT_WALLET_ADDRESS`
- `ARC_RESEARCH_WALLET_ADDRESS`
- `ARC_FACT_CHECK_WALLET_ADDRESS`
- `ARC_SUMMARY_WALLET_ADDRESS`

## Step 3. Fund wallets

Fund these wallets from the Circle Faucet or Console Faucet:

- validator wallet
- client wallet

The provider wallets do not need direct faucet funding for the basic flow, because the job script can transfer starter USDC from the client wallet.

Recommended for the first run:

- validator wallet: at least `0.1` testnet USDC
- client wallet: at least `0.3` testnet USDC

## Step 4. Set metadata URIs

Edit `.env.local` and replace:

- `ARC_RESEARCH_METADATA_URI`
- `ARC_FACT_CHECK_METADATA_URI`
- `ARC_SUMMARY_METADATA_URI`

For the first live run, simple placeholder IPFS URIs are acceptable if they resolve to stable metadata later.

## Step 5. Register agents on Arc

Run:

```bash
npm run arc:register-agents
```

If you want to register one role at a time:

```bash
npm run arc:register-agents research
npm run arc:register-agents factCheck
npm run arc:register-agents summary
```

Expected outcome:

- identity NFT minted in `IdentityRegistry`
- reputation feedback written by the validator
- validation request and response completed

## Step 6. Run the first real marketplace job

Run:

```bash
npm run arc:run-job research
```

You can also pass a custom job description:

```bash
npm run arc:run-job summary "Summarize the gaps in Arc-native agent commerce products"
```

Expected onchain flow:

1. optional starter USDC transfer from client to provider
2. `createJob`
3. `setBudget`
4. `approve`
5. `fund`
6. `submit`
7. `complete`

For the strongest demo, run all three roles one after another:

```bash
npm run arc:run-job research
npm run arc:run-job factCheck
npm run arc:run-job summary
```

## Step 7. Verify transactions

Check:

- terminal tx hashes
- Arc Explorer links
- `GET /api/arc/status`

If the app is running locally, you can also inspect:

- `POST /api/arc/bootstrap`
- `POST /api/arc/register-agents`
- `POST /api/arc/run-job`

## Suggested first-run order

1. `npm run dev`
2. `npm run arc:bootstrap`
3. fund validator and client wallets
4. update `.env.local`
5. `npm run arc:register-agents`
6. `npm run arc:run-job research`
7. verify txs in Arc Explorer

## Common failure cases

- `CIRCLE_API_KEY` missing or invalid
- `CIRCLE_ENTITY_SECRET` missing or not registered
- client wallet not funded enough for gas + job budget
- validator wallet not funded enough for reputation and validation txs
- invalid or empty metadata URIs

## Good demo setup

For the hackathon demo, register all three provider agents first, then run:

- one `research` job
- one `factCheck` job
- one `summary` job

That gives you a clean base for showing repeated, role-specific `agent-to-agent` settlement on Arc, and it matches the live proof now shown on the homepage.
