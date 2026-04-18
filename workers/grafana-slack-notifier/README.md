# grafana-slack-notifier

Cloudflare Worker that receives Grafana webhook alerts and posts clean messages to Slack.

## Cloudflare account

- **Account ID:** a7b0ffea9218ed3fbf07524e2dfea3c0
- **Worker URL:** https://avocado-grafana-notifier.developer-a7b.workers.dev

## How it works

Grafana fires a webhook to the Worker URL when an alert fires. The Worker extracts the alert name and `annotations.summary` from the payload and posts a Block Kit message to Slack. Resolved/normal alerts are silently dropped.

## Setup

### Prerequisites

- Node.js
- Cloudflare account (see above)
- Slack incoming webhook URL

### Install

```bash
npm install
```

### Secrets

```bash
npx wrangler secret put SLACK_WEBHOOK_URL --config workers/grafana-slack-notifier/wrangler.toml
```

### Deploy

```bash
npx wrangler deploy --config workers/grafana-slack-notifier/wrangler.toml
```

## Grafana configuration

Each alert rule that should use this notifier needs:

1. `notification_settings.receiver` set to `avocado-grafana-notifier`
2. `annotations.summary` set to the message body (supports Grafana Go templates)

The Slack message will render as:

```
*<alertname>*
<annotations.summary>
```

## Currently wired alerts

| Alert | Grafana Rule UID |
|-------|-----------------|
| New User Registration — Production | `efhb3plf9nl6oc` |
