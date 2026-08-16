import { shopifyFetch } from "./client";
import {
  COLLECTION_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
} from "./queries/collections";
import { normalizeProduct } from "./products";

const DEFAULT_COLLECTION_COUNT = 12;
const DEFAULT_COLLECTION_PRODUCT_COUNT = 12;
const DEFAULT_IMAGE_COUNT = 6;
const DEFAULT_VARIANT_COUNT = 24;

function getConnectionNodes(connection) {
  if (!Array.isArray(connection?.edges)) {
    return [];
  }

  return connection.edges.map((edge) => edge?.node).filter(Boolean);
}

function normalizePageInfo(pageInfo) {
  return {
    hasNextPage: Boolean(pageInfo?.hasNextPage),
    hasPreviousPage: Boolean(pageInfo?.hasPreviousPage),
    startCursor: pageInfo?.startCursor ?? null,
    endCursor: pageInfo?.endCursor ?? null,
  };
}

function normalizeImage(image) {
  if (!image?.url) {
    return null;
  }

  return {
    url: image.url,
    altText: image.altText ?? "",
    width: image.width ?? null,
    height: image.height ?? null,
  };
}

function normalizeCollection(collection) {
  if (!collection) {
    return null;
  }

  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description: collection.description ?? "",
    image: normalizeImage(collection.image),
  };
}

function normalizeCollectionWithProducts(collection) {
  const normalizedCollection = normalizeCollection(collection);

  if (!normalizedCollection) {
    return null;
  }

  return {
    ...normalizedCollection,
    products: getConnectionNodes(collection.products)
      .map(normalizeProduct)
      .filter(Boolean),
    pageInfo: normalizePageInfo(collection.products?.pageInfo),
  };
}

export async function getCollections({
  first = DEFAULT_COLLECTION_COUNT,
  after,
  revalidate,
} = {}) {
  const data = await shopifyFetch({
    query: COLLECTIONS_QUERY,
    variables: {
      first,
      after,
    },
    revalidate,
    tags: ["shopify", "collections"],
  });

  return {
    collections: getConnectionNodes(data?.collections)
      .map(normalizeCollection)
      .filter(Boolean),
    pageInfo: normalizePageInfo(data?.collections?.pageInfo),
  };
}

export async function getCollection(
  handle,
  {
    productCount = DEFAULT_COLLECTION_PRODUCT_COUNT,
    productAfter,
    revalidate,
  } = {},
) {
  if (!handle || typeof handle !== "string") {
    throw new Error("A collection handle is required.");
  }

  const data = await shopifyFetch({
    query: COLLECTION_BY_HANDLE_QUERY,
    variables: {
      handle,
      productCount,
      productAfter,
      imageCount: DEFAULT_IMAGE_COUNT,
      variantCount: DEFAULT_VARIANT_COUNT,
    },
    revalidate,
    tags: ["shopify", "collections", `collection:${handle}`],
  });

  return normalizeCollectionWithProducts(data?.collection);
}
