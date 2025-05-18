import { vendureApiClient } from '$lib/services/api-services/vendureApiClient';

export async function getCollectionFacets(collectionSlug: string, fetch?: typeof globalThis.fetch) {
  const query = `
    query SearchFacets($input: SearchInput!) {
      search(input: $input) {
        facetValues {
          count
          facetValue {
            id
            name
            facet { id name }
          }
        }
      }
    }
  `;
  const variables = {
    input: {
      collectionSlug,
      take: 0 // Don't fetch products, just facets
    }
  };
  const result = await vendureApiClient({ query, variables, fetch });
  return result?.data?.search?.facetValues?.map((fv: any) => fv.facetValue) || [];
}

export async function getProductsByCollection(
  collectionSlug: string,
  page: number = 1,
  itemsPerPage: number = 12,
  facetValueIds: string[] = [],
  minPrice?: number,
  maxPrice?: number,
  fetch?: typeof globalThis.fetch,
  sort: string = 'newest'
) {
  const skip = (page - 1) * itemsPerPage;
  const collectionQuery = `
    query GetCollection($slug: String!) {
      collection(slug: $slug) {
        id
        name
        description
        slug
        featuredAsset { preview }
        
      }
    }
  `;

  const searchQuery = `
    query SearchProducts($input: SearchInput!) {
      search(input: $input) {
        totalItems
        items {
          productId
          productName
          slug
          description
          productAsset { preview }
          price {
            ... on SinglePrice { value }
            ... on PriceRange { min max }
          }
          priceWithTax {
            ... on SinglePrice { value }
            ... on PriceRange { min max }
          }
          currencyCode
          facetValueIds
        }
        facetValues {
          count
          facetValue {
            id
            name
            facet { id name }
          }
        }
      }
    }
  `;
  // Fetch collection metadata
  const collectionResult = await vendureApiClient({ query: collectionQuery, variables: { slug: collectionSlug }, fetch });
  const collection = collectionResult?.data?.collection ?? null;

  // Prepare search input for products
  const input: Record<string, any> = {
    groupByProduct: true,
    collectionSlug: collectionSlug,
    take: itemsPerPage,
    skip,
  };
  // Add sort logic
  switch (sort) {
    case 'price-asc':
      input.sort = { price: 'ASC' };
      break;
    case 'price-desc':
      input.sort = { price: 'DESC' };
      break;
    case 'name-asc':
      input.sort = { name: 'ASC' };
      break;
    case 'name-desc':
      input.sort = { name: 'DESC' };
      break;
    case 'newest':
    default:
      // Remove sort for 'newest' (Vendure may sort by relevance or createdAt DESC by default)
      // input.sort = { createdAt: 'DESC' };
      break;
  }
  if (facetValueIds.length > 0) input.facetValueFilters = [{ or: facetValueIds }];
  if (minPrice !== undefined || maxPrice !== undefined) {
    input.priceRange = {};
    if (minPrice !== undefined) input.priceRange.min = minPrice;
    if (maxPrice !== undefined) input.priceRange.max = maxPrice;
  }

  const searchResult = await vendureApiClient({ query: searchQuery, variables: { input }, fetch });
  const products = searchResult?.data?.search ?? { items: [], totalItems: 0, facetValues: [] };

  return {
    collection,
    products
  };

}
