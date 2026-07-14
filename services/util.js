const fetchFromContentful = async (query, variables) => {
  const spaceId =
    process.env.CONTENTFUL_SPACE_ID ||
    process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const accessToken =
    process.env.CONTENTFUL_DELIVERY_API_KEY ||
    process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_API_KEY;

  if (!spaceId || !accessToken) {
    throw new Error('Contentful space ID or delivery API key is missing.');
  }

  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    }
  );

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

export { fetchFromContentful };
