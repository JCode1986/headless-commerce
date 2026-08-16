import "server-only";

const DEFAULT_REVALIDATE_SECONDS = 300;

class ShopifyConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "ShopifyConfigError";
  }
}

class ShopifyApiError extends Error {
  constructor(message) {
    super(message);
    this.name = "ShopifyApiError";
  }
}

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new ShopifyConfigError(
      `Missing required Shopify environment variable: ${name}. Add it to .env.local.`,
    );
  }

  return value;
}

function normalizeStoreDomain(domain) {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function getStorefrontApiConfig() {
  const storeDomain = normalizeStoreDomain(
    getRequiredEnv("SHOPIFY_STORE_DOMAIN"),
  );
  const apiVersion = getRequiredEnv("SHOPIFY_API_VERSION");
  const storefrontAccessToken = getRequiredEnv(
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  );

  return {
    endpoint: `https://${storeDomain}/api/${apiVersion}/graphql.json`,
    storefrontAccessToken,
  };
}

function getFetchOptions({ query, variables, cache, revalidate, tags }) {
  const { endpoint, storefrontAccessToken } = getStorefrontApiConfig();
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  if (cache === "no-store") {
    options.cache = "no-store";
  } else {
    options.next = {
      revalidate,
      tags,
    };
  }

  return { endpoint, options };
}

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    throw new ShopifyApiError(
      "Shopify Storefront API returned an invalid JSON response.",
    );
  }
}

function getGraphQLErrorMessage(errors) {
  return errors
    .map((error) => error?.message)
    .filter(Boolean)
    .join("; ");
}

export async function shopifyFetch({
  query,
  variables = {},
  cache = "force-cache",
  revalidate = DEFAULT_REVALIDATE_SECONDS,
  tags = ["shopify"],
} = {}) {
  if (!query) {
    throw new ShopifyApiError("A Shopify GraphQL query is required.");
  }

  const { endpoint, options } = getFetchOptions({
    query,
    variables,
    cache,
    revalidate,
    tags,
  });

  let response;

  try {
    response = await fetch(endpoint, options);
  } catch {
    throw new ShopifyApiError(
      "Unable to connect to the Shopify Storefront API.",
    );
  }

  const result = await parseJsonResponse(response);

  if (!response.ok) {
    throw new ShopifyApiError(
      `Shopify Storefront API request failed with status ${response.status}.`,
    );
  }

  if (Array.isArray(result.errors) && result.errors.length > 0) {
    const message = getGraphQLErrorMessage(result.errors);

    throw new ShopifyApiError(
      message
        ? `Shopify Storefront API GraphQL error: ${message}`
        : "Shopify Storefront API returned a GraphQL error.",
    );
  }

  return result.data;
}
