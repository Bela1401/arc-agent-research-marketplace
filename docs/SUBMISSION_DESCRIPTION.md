# Submission Description

## One-line summary

Arc Agent Research Marketplace lets one manager agent split a user request into specialist microtasks, pay each specialist in `USDC` on Arc, and resell the final report through a premium x402 unlock.

## Track

`Agent-to-Agent Payment Loop`

## Problem

Most AI products still treat agents like internal software features instead of independent economic actors.
That breaks down when a workflow needs:

- a specialist researcher
- a separate verifier
- a summarizer or evaluator
- transparent machine-to-machine payment between them

Traditional chains make high-frequency micro-settlement too expensive and too noisy for this model.

## Solution

We built a marketplace where:

1. a manager agent turns one research brief into role-specific microtasks
2. specialist agents handle `research`, `factCheck`, and `summary`
3. every task is individually budgeted and settled in `USDC`
4. agent identity, validation, and reputation are written on Arc via `ERC-8004`
5. job execution is settled on Arc via `ERC-8183`
6. the resulting report can be previewed for free and unlocked through a premium x402-compatible paywall

## Why Arc

Arc fits this use case because the product only works if per-action settlement stays cheap enough for machine-to-machine commerce.

Arc gives us:

- stablecoin-native payments in `USDC`
- fast enough execution for repeated agent jobs
- credible economics for sub-cent or near-sub-cent actions
- a clean narrative for the emerging agentic economy

## Circle + Arc stack

- Circle Developer-Controlled Wallets for wallet creation and signing
- Circle Developer Console for wallet and transaction operations
- Arc Testnet for execution
- `ERC-8004` for agent identity, validator feedback, and validation
- `ERC-8183` for job creation, funding, submission, and completion
- Nanopayments / x402 for pay-per-report monetization
- Next.js for the demo dashboard and operator tooling

## Live product proof

The shipped demo now includes:

- a homepage with recent live Arc jobs and explorer links
- a browser launcher for new jobs
- judge mode with one-click autoplay demo
- a premium teaser and paywall layer for report resale
- economics UI that explains why the model breaks on traditional gas-heavy rails

The environment has already crossed the `50+` transaction threshold required by the hackathon. The homepage shows the latest visible portion of this onchain activity with explorer-ready tx links.

## What judges should notice

- This is not only a mock frontend. Judges can trigger a fresh live job from the browser and watch it land in recent runs.
- The same workflow has both settlement logic and a monetization layer, which makes the business model much stronger.
- The margin calculator explicitly shows why Arc is the right rail for this kind of per-action agent commerce.

## Circle Product Feedback

Products used:

- Arc
- USDC
- Circle Wallets
- Circle Developer Console
- Nanopayments / x402-compatible premium access

Why we chose them:

- We needed programmable wallets, low-cost settlement, and a realistic micropayment path for agent-to-agent work.

What worked well:

- Circle wallet setup made the programmable signing flow possible.
- Arc made low-value specialist jobs and premium unlocks economically believable.

What could be improved:

- A clearer hackathon-first setup flow for entity secret registration and wallet bootstrapping would reduce onboarding friction.
- More official end-to-end examples combining Arc, Circle wallets, and x402 in one app would make shipping faster.

Recommendations:

- Publish a first-party starter that bundles browser-triggered jobs, Circle wallets, Arc settlement, and x402 resale in one reference implementation.

## Next expansion

- batch multiple jobs from one client prompt
- persist reports and metadata into durable storage
- add live LLM outputs for each specialist role
- add richer analytics for agent reputation and job throughput
