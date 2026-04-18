export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response('Bad Request', { status: 400 });
    }

    const firingAlerts = (payload.alerts ?? []).filter(a => a.status === 'firing');
    if (firingAlerts.length === 0) {
      return new Response('OK', { status: 200 });
    }

    const alert = firingAlerts[0];
    const title = alert.labels?.alertname ?? 'Alert';
    const summary = alert.annotations?.summary;
    const text = summary
      ? `*${title}*\n${summary}`
      : `*${title}*`;

    const resp = await fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blocks: [{ type: 'section', text: { type: 'mrkdwn', text } }],
      }),
    });

    return resp.ok
      ? new Response('OK', { status: 200 })
      : new Response('Slack error', { status: 502 });
  },
};
