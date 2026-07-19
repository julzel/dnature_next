const MAX_MESSAGE_LENGTH = 500;

const redactString = (value) =>
  String(value || '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
    .replace(/\+?\d[\d\s()-]{6,}\d/g, '[redacted-phone]')
    .slice(0, MAX_MESSAGE_LENGTH);

const createMonitoringEvent = (error, context = {}) => ({
  name: redactString(error?.name || 'Error'),
  message: redactString(error?.message || 'Unknown error'),
  source: redactString(context.source || 'client'),
  path: redactString(context.path || ''),
  occurredAt: new Date().toISOString(),
});

const reportClientError = (error, context = {}) => {
  if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
    return;
  }

  const event = createMonitoringEvent(error, {
    ...context,
    path: context.path || window.location.pathname,
  });

  window.fetch('/api/monitoring', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(event),
    keepalive: true,
  }).catch(() => {
    // Monitoring must never affect the customer-facing error recovery path.
  });
};

export { createMonitoringEvent, redactString, reportClientError };
