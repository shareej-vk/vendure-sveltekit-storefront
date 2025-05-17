import { vendureApiClient } from '$lib/services/api-services/vendureApiClient';

export async function searchResults({
  query,
  categoryIds = [],
  skip = 0,
  take = 12,
  sort = 'relevance',
  minPrice = '',
  maxPrice = '',
  fetch,
  debugLabel
}: {
  query: string;
  categoryIds?: string[];
  skip?: number;
  take?: number;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  fetch: typeof globalThis.fetch;
  debugLabel?: string;
}) {
  // Build variables for Vendure search
  const input: Record<string, any> = {
    term: query,
    skip,
    take,
    facetValueIds: categoryIds,
    priceRange: (minPrice || maxPrice) ? { min: Number(minPrice) || 0, max: Number(maxPrice) || undefined } : undefined
  };
  console.log('[searchResultsApi] facetValueIds sent:', categoryIds);

  // Map sort string to Vendure sort param
  let sortParam: any = undefined;
  if (sort === 'newest') sortParam = { createdAt: 'DESC' };
  else if (sort === 'price-asc') sortParam = { price: 'ASC' };
  else if (sort === 'price-desc') sortParam = { price: 'DESC' };
  else if (sort === 'name-asc') sortParam = { name: 'ASC' };
  else if (sort === 'name-desc') sortParam = { name: 'DESC' };
  if (sortParam) input.sort = sortParam;

  const queryGql = `
    query SearchResults($input: SearchInput!) {
      search(input: $input) {
        items {
          productId
          productName
          slug
          description
          productAsset { preview }
          priceWithTax { ... on PriceRange { min max } ... on SinglePrice { value } }
          currencyCode
          facetValueIds
          collectionIds
          productVariantId
          price { ... on PriceRange { min max } ... on SinglePrice { value } }

        }
        totalItems
        facetValues {
          count
          facetValue {
            id
            name
            facet {
              id
              name
            }
          }
        }
      }
    }
  `;

  const { data, errors } = await vendureApiClient({
    query: queryGql,
    variables: { input },
    fetch,
    debugLabel
  });
  if (errors) throw new Error(errors[0]?.message || 'GraphQL error');
  
  console.log('[searchResultsApi] data.search:', JSON.stringify(data.search));

  return data.search;
}
