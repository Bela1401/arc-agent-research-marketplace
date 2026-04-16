# Submission Description

## One-line summary

Agent-to-Agent Research Marketplace lets one manager agent split a user request into specialist microtasks, pay each specialist in `USDC`, and settle the full workflow on `Arc Testnet`.

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

## Why Arc

Arc fits this use case because the product only works if per-action settlement stays cheap enough for machine-to-machine commerce.

Arc gives us:

- stablecoin-native payments in `USDC`
- fast enough execution for repeated agent jobs
- credible economics for sub-cent or near-sub-cent actions
- a clean narrative for the emerging agentic economy

## Circle + Arc stack

- Circle Developer-Controlled Wallets for wallet creation and signing
- Arc Testnet for execution
- `ERC-8004` for agent identity, validator feedback, and validation
- `ERC-8183` for job creation, funding, submission, and completion
- Next.js for the demo dashboard and operator tooling

## Live proof completed

Successful testnet run completed on `2026-04-16`:

- `5` Circle wallets bootstrapped
- `3` provider agents registered
- `3` real marketplace jobs completed
- `21` ERC-8183 lifecycle transactions proved across those jobs

Completed jobs:

- `research` job `#3437`
- `factCheck` job `#3438`
- `summary` job `#3439`

Average job budget in the live run: `0.008 USDC`

## What judges should notice

- This is not just a mock frontend. The repo already contains successful live Arc runs.
- The model is easy to scale into dozens of onchain microtransactions by repeating specialist jobs.
- The business logic maps naturally to real agent marketplaces, bounties, and modular AI workflows.

## Next expansion

- batch multiple jobs from one client prompt
- persist reports and metadata instead of keeping the dashboard partly mocked
- add live LLM outputs for each specialist role
- run enough repeated jobs to comfortably exceed the `50+` transaction showcase target
