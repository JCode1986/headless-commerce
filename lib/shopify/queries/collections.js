import { PRODUCT_FRAGMENT } from "./products";

const COLLECTION_FIELDS = `#graphql
  id
  handle
  title
  description
  image {
    url
    altText
    width
    height
  }
`;

const COLLECTION_WITH_PRODUCTS_FRAGMENT = `#graphql
  fragment CollectionWithProductsFields on Collection {
    ${COLLECTION_FIELDS}
    products(first: $productCount, after: $productAfter) {
      edges {
        cursor
        node {
          ...ProductFields
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }

  ${PRODUCT_FRAGMENT}
`;

export const COLLECTIONS_QUERY = `#graphql
  query Collections($first: Int!, $after: String) {
    collections(first: $first, after: $after, sortKey: TITLE) {
      edges {
        cursor
        node {
          ${COLLECTION_FIELDS}
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const COLLECTION_BY_HANDLE_QUERY = `#graphql
  query CollectionByHandle(
    $handle: String!
    $productCount: Int!
    $productAfter: String
    $imageCount: Int!
    $variantCount: Int!
  ) {
    collection(handle: $handle) {
      ...CollectionWithProductsFields
    }
  }

  ${COLLECTION_WITH_PRODUCTS_FRAGMENT}
`;
