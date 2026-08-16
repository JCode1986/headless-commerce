export const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFields on Product {
    id
    handle
    title
    description
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: $imageCount) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      id
      name
      values
    }
    variants(first: $variantCount) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const PRODUCTS_QUERY = `#graphql
  query Products($first: Int!, $after: String, $imageCount: Int!, $variantCount: Int!) {
    products(first: $first, after: $after, sortKey: TITLE) {
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

export const PRODUCT_BY_HANDLE_QUERY = `#graphql
  query ProductByHandle($handle: String!, $imageCount: Int!, $variantCount: Int!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }

  ${PRODUCT_FRAGMENT}
`;
