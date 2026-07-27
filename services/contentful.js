import 'server-only';

const CONTENTFUL_TIMEOUT_MS = 5000;
const DEFAULT_CONTENTFUL_ENVIRONMENT = 'master';

const buildContentfulGraphqlUrl = (
  spaceId,
  environmentId = DEFAULT_CONTENTFUL_ENVIRONMENT
) =>
  `https://graphql.contentful.com/content/v1/spaces/${encodeURIComponent(
    spaceId
  )}/environments/${encodeURIComponent(environmentId)}`;

const fetchFromContentful = async (query, variables, next) => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_DELIVERY_API_KEY;
  const environmentId =
    process.env.CONTENTFUL_ENVIRONMENT_ID || DEFAULT_CONTENTFUL_ENVIRONMENT;

  if (!spaceId || !accessToken) {
    throw new Error('Contentful space ID or delivery API key is missing.');
  }

  const response = await fetch(buildContentfulGraphqlUrl(spaceId, environmentId), {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next,
    signal: AbortSignal.timeout(CONTENTFUL_TIMEOUT_MS),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors?.length) {
    const error = new Error(
      payload.errors?.[0]?.message ||
        `Contentful request failed with status ${response.status}.`
    );

    // Preserve the response shape used by callers that can render partial data.
    error.response = {
      status: response.status,
      data: payload.data,
      errors: payload.errors,
    };

    throw error;
  }

  return payload.data;
};

export { buildContentfulGraphqlUrl, fetchFromContentful };
