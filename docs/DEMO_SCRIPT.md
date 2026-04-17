# Demo Script

## Opening line

Start on `/judges` and say:

`This project turns agent workflows into real economic actors on Arc by routing specialist work, settling each step in USDC, and keeping the proof visible in the product.`

## 90-second flow

1. Open `/judges` and point at:
   - recent live jobs
   - visible tx links
   - premium unlock price
   - the one-click autopilot flow
2. Paste `ARC_ADMIN_API_TOKEN` and click `Autopilot demo`.
3. Let the app redirect back to `/#recent` with the newly focused job.
4. Show the new live job card:
   - budget
   - timestamps
   - provider and client wallets
   - tx trail links
5. Open `/api/reports/teaser` and explain that the free teaser leads into a paid x402 unlock.
6. Open `/api/reports/premium` and explain that the finished report becomes resellable inventory.
7. Scroll to the economics section and explain the `<= $0.01` pricing and margin story.
8. Open the Circle Developer Console and show the wallet / transaction context.
9. Open one Arc explorer link from the homepage tx trail.

## Required video reminder

The hackathon submission video must include:

- a transaction step visible through Circle infrastructure
- verification of that transaction on the Arc Block Explorer

Do not record only the frontend. The screencast should show both systems.

## If you want to rerun live from the terminal

```bash
npm run arc:run-job research
npm run arc:run-job factCheck
npm run arc:run-job summary
```

## Closing line

Arc makes machine-to-machine stablecoin settlement cheap enough that specialist agents can behave like real economic actors, and x402 lets the finished output keep earning after the job is done.
