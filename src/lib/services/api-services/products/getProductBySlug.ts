import { vendureApiClient } from '../vendureApiClient';

export async function getProductBySlug(slug: string, fetch?: typeof globalThis.fetch) {
  const query = `
    query GetProductBySlug($slug: String!) {
      product(slug: $slug) {
        id
        name
        slug
        description
        featuredAsset {
          preview
        }
        variants {
          id
          name
          price
          priceWithTax
          currencyCode
          sku
          stockLevel
        }
        collections {
          id
          name
          slug
        }
        facetValues {
          id
          name
          facet {
            id
            name
          }
        }
      }
    }
  `;

  const variables = { slug };
  console.log('[getProductBySlug] Querying with slug:', slug);
  const result = await vendureApiClient({ query, variables, fetch, debugLabel: 'getProductBySlug' });
  console.log('[getProductBySlug] API response:', JSON.stringify(result));
  return result?.data?.product || null;
}
