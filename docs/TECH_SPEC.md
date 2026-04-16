# Tech Spec

## Product summary

`Agent-to-Agent Research Marketplace` is a hackathon MVP where a manager agent breaks a user research brief into paid microtasks, specialist agents execute those tasks, and every step settles in `USDC` on `Arc Testnet`.

## User story

As a founder or operator, I want to submit a research question and have a network of specialist agents complete the work with transparent per-task pricing, verifiable deliverables, and visible payment settlement.

## Core workflow

1. User submits a research brief.
2. Manager agent decomposes it into microtasks.
3. Each task is assigned to a specialist agent.
4. A job is created and funded onchain.
5. Agent submits a deliverable hash and offchain preview.
6. Evaluator marks the result complete.
7. Final report is synthesized from completed tasks.

## Scope for hackathon MVP

- Single project workspace
- Fixed catalog of `3` specialist agents
- Fixed pricing model below `1 cent` per action
- Mock orchestration with real Arc transaction integration points
- Judge-friendly dashboard for task progress and economics

## Out of scope

- Open marketplace with public bidding
- Full dispute resolution
- Multi-tenant auth
- Production-grade billing

## Main entities

### AgentProfile

- Role
- Reputation score
- Onchain identity reference
- Wallet address
- Price per task

### MicroTask

- Title and description
- Assigned agent
- Price
- Status
- Deliverable hash
- Result preview

### ResearchProject

- Brief
- Final report
- Task list
- Transaction log

## Pricing model

- Research task: `0.006 USDC`
- Fact-check task: `0.004 USDC`
- Summary task: `0.008 USDC`

## Success metrics

- `50+` onchain transactions in demo
- Average task price under `$0.01`
- Complete project run from prompt to report
- Clear explorer links for transaction verification

## Integration points

- Arc Testnet RPC
- Circle Wallets for programmatic wallet management
- `ERC-8004` identity registration for agents
- `ERC-8183` job settlement for microtasks

## Demo mode

The starter repo ships with mocked project data and a simulated expanded run endpoint so the product can be demoed visually before live chain wiring is complete.
