// Fetch all possible facet values for all groups (categories, brands, attributes, etc) from Vendure
import { vendureApiClient } from '$lib/services/api-services/vendureApiClient';

export async function getAllFacets(fetch: typeof globalThis.fetch) {
  const query = `
    query AllFacets {
      facets {
        items {
          id
          name
          code
          values {
            id
            name
            code
            facet { id name }
          }
        }
      }
    }
  `;
  const { data } = await vendureApiClient({ query, fetch });
  // Flatten all facet values from all groups
  const allFacetValues = [];
  for (const facet of data.facets.items) {
    for (const value of facet.values) {
      allFacetValues.push({
        ...value,
        facetName: facet.name
      });
    }
  }
  return allFacetValues;
}
