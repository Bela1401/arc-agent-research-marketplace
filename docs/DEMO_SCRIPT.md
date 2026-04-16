# Demo Script

## Opening

Open the homepage and start with the `Live Arc proof` section.
Lead with this line:

`We already completed real Arc Testnet jobs with Circle wallets, so this demo is showing live proof first and the productized UX second.`

## 60-second flow

1. Show the four top stats:
   - `3` completed jobs
   - `21` ERC-8183 lifecycle transactions
   - `5` live wallets
   - average budget `0.008 USDC`
2. Scroll the wallet map and explain the roles:
   - validator
   - client
   - research provider
   - fact-check provider
   - summary provider
3. Open one or two explorer links from the live proof cards.
4. Point at the real completed jobs:
   - `research` job `#3437`
   - `factCheck` job `#3438`
   - `summary` job `#3439`
5. Explain the repeated job lifecycle:
   - `createJob`
   - `setBudget`
   - `approve`
   - `fund`
   - `submit`
   - `complete`
6. Scroll down to the polished dashboard and explain that this is the operator-facing UI we are productizing on top of the live settlement rail.

## If you want to rerun live during the demo

Use these commands:

```bash
npm run arc:register-agents
npm run arc:run-job research
npm run arc:run-job factCheck
npm run arc:run-job summary
```

## Closing line

This works because Arc makes machine-to-machine stablecoin settlement cheap enough that specialized agents can behave like real economic actors instead of fake internal function calls.
