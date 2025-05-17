import { vendureApiClient } from '$lib/services/api-services/vendureApiClient';

export async function featuredProducts(fetch?: typeof globalThis.fetch, take: number = 8) {
  const query = `
    query GetFeaturedProducts($take: Int!) {
      products(options: { take: $take, sort: { name: ASC } }) {
        items {
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
    }
  `;
  const variables = { take };
  const { data } = await vendureApiClient({ query, variables, fetch });
  return (
    data?.products?.items?.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      image: item.featuredAsset?.preview,
      price: item.variants?.[0]?.priceWithTax ? (item.variants[0].priceWithTax / 100).toFixed(2) : null,
      variants: item.variants,
      collections: item.collections,
      facetValues: item.facetValues
    })) ?? []
  );
}
