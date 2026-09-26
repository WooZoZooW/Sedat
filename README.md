This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Agent Hub control plane

The control plane is an independently configured Cloudflare Worker in `agent-hub/worker`. It does not change the existing static Pages site or its production configuration. A Durable Object stores tasks and serializes claims. User task requests require a Cloudflare Access JWT; workstation requests use a separate bearer secret. The browser must never contain either credential. Configure an authenticated same-origin server/session integration before connecting a browser client.

Tasks carry a logical project ID, text command, optional transcript, small metadata, and optional HTTPS image references. Terminal tasks are retained for 30 days, the queue accepts at most 500 active tasks, and each authenticated user can create at most 10 tasks per 10 minutes. The Worker only accepts project IDs in `AGENT_PROJECTS`. The local Agent Hub maps those IDs to administrator-configured absolute workspace paths; request data cannot select a path or executable. The Codex adapter invokes the configured Codex CLI in ephemeral workspace-write sandbox mode without a shell. No remote shell endpoint is provided.

### Worker configuration

Set `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` as Worker variables for the Cloudflare Access application that protects the control plane. `AGENT_ID` and the JSON `AGENT_PROJECTS` allow-list are in `wrangler.agent-hub.jsonc`. Set the workstation credential as a Worker secret; generate an independent random value of at least 32 characters and do not put it in source control:

```sh
wrangler secret put AGENT_TOKEN --config wrangler.agent-hub.jsonc
```

Before exposing a Worker URL, configure its Cloudflare Access policy and a Cloudflare rate limit for authenticated task creation. Keep the static Pages deployment configured by the existing `wrangler.jsonc`; the separate Agent Hub configuration has no route and does not deploy or change the website.

### Local Agent Hub

Use Node.js 20 or newer and install Codex CLI on the workstation. Copy `agent-hub.config.example.json` to the ignored `agent-hub.config.json`, set the Worker URL, and map each allowed logical project ID to its trusted absolute workspace. Set `AGENT_TOKEN` in the process environment (never in that file), then start the poller:

```sh
AGENT_TOKEN='(secret from your workstation secret store)' node agent-hub/hub/hub.mjs
```

The hub registers, polls for one task at a time, starts it, renews its lease while the adapter runs, and reports only a bounded completion result or a generic failure. Lost heartbeats allow a lease to expire and a task to be retried up to three claims. Run it against a dedicated local feature branch; this first version leaves review, commit, and push to the workstation operator. The Worker exposes `GET /healthz`, user task creation/status/cancellation at `/v1/tasks`, and authenticated workstation operations under `/v1/agent`. See `agent-hub/worker/test/control-plane.test.mjs` for request and lifecycle examples.

Run the control-plane tests with `npm run test:agent-hub` under Node.js 22.5 or newer (`node:sqlite` is used only by the test harness). Safe local Worker validation can use `wrangler dev --local --config wrangler.agent-hub.jsonc`; production deployment is deliberately separate from the current Pages site.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
