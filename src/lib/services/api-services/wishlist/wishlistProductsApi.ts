import { vendureApiClient } from '../vendureApiClient';

export async function getProductsByIds(productIds: string[], fetchFn?: typeof fetch) {
  if (!productIds.length) return [];
  const query = `
    query WishlistProducts($ids: [ID!]!) {
      wishlistProducts(ids: $ids) {
        id
        name
        slug
        description
        featuredAsset { preview }
        variants {
          id
          name
          price
          priceWithTax
          currencyCode
        }
      }
    }
  `;
  const variables = { ids: productIds };
  const res = await vendureApiClient({ query, variables, fetch: fetchFn });
  return res?.data?.wishlistProducts || [];
}
