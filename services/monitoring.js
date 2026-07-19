import 'server-only';

import { createMonitoringEvent } from '../util/monitoring';

const reportServerError = async (error, context = {}) => {
  const event = createMonitoringEvent(error, { ...context, source: context.source || 'server' });
  const endpoint = process.env.MONITORING_INGEST_URL;

  if (!endpoint) {
    console.error(JSON.stringify({ type: 'dnature-monitoring', ...event }));
    return;
  }

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(process.env.MONITORING_INGEST_TOKEN
          ? { authorization: `Bearer ${process.env.MONITORING_INGEST_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(3000),
      cache: 'no-store',
    });
  } catch (reportingError) {
    console.error(
      JSON.stringify({
        type: 'dnature-monitoring-delivery-failed',
        ...createMonitoringEvent(reportingError, { source: 'monitoring' }),
      })
    );
  }
};

export { reportServerError };
