import { shopifyFetch } from "./client";
import { PRODUCT_BY_HANDLE_QUERY, PRODUCTS_QUERY } from "./queries/products";

const DEFAULT_PRODUCT_COUNT = 12;
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

function normalizeMoney(money) {
  if (!money) {
    return null;
  }

  return {
    amount: money.amount,
    currencyCode: money.currencyCode,
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

function normalizeOption(option) {
  return {
    id: option.id,
    name: option.name,
    values: Array.isArray(option.values) ? option.values : [],
  };
}

function normalizeVariant(variant) {
  return {
    id: variant.id,
    title: variant.title,
    availableForSale: Boolean(variant.availableForSale),
    selectedOptions: Array.isArray(variant.selectedOptions)
      ? variant.selectedOptions.map((option) => ({
          name: option.name,
          value: option.value,
        }))
      : [],
    price: normalizeMoney(variant.price),
    compareAtPrice: normalizeMoney(variant.compareAtPrice),
    image: normalizeImage(variant.image),
  };
}

export function normalizeProduct(product) {
  if (!product) {
    return null;
  }

  const images = getConnectionNodes(product.images)
    .map(normalizeImage)
    .filter(Boolean);

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description ?? "",
    availableForSale: Boolean(product.availableForSale),
    featuredImage: normalizeImage(product.featuredImage),
    images,
    priceRange: {
      minVariantPrice: normalizeMoney(product.priceRange?.minVariantPrice),
      maxVariantPrice: normalizeMoney(product.priceRange?.maxVariantPrice),
    },
    options: Array.isArray(product.options)
      ? product.options.map(normalizeOption)
      : [],
    variants: getConnectionNodes(product.variants).map(normalizeVariant),
  };
}

export async function getProducts({
  first = DEFAULT_PRODUCT_COUNT,
  after,
  revalidate,
} = {}) {
  const data = await shopifyFetch({
    query: PRODUCTS_QUERY,
    variables: {
      first,
      after,
      imageCount: DEFAULT_IMAGE_COUNT,
      variantCount: DEFAULT_VARIANT_COUNT,
    },
    revalidate,
    tags: ["shopify", "products"],
  });

  return {
    products: getConnectionNodes(data?.products)
      .map(normalizeProduct)
      .filter(Boolean),
    pageInfo: normalizePageInfo(data?.products?.pageInfo),
  };
}

export async function getProduct(handle, { revalidate } = {}) {
  if (!handle || typeof handle !== "string") {
    throw new Error("A product handle is required.");
  }

  const data = await shopifyFetch({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: {
      handle,
      imageCount: DEFAULT_IMAGE_COUNT,
      variantCount: DEFAULT_VARIANT_COUNT,
    },
    revalidate,
    tags: ["shopify", "products", `product:${handle}`],
  });

  return normalizeProduct(data?.product);
}
