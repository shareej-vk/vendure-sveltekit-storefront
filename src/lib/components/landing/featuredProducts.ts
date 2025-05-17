import { vendureApiClient } from '../../services/api-services/vendureApiClient';

export async function featuredProducts() {
  const query = `
    query {
      search(input: { take: 8, groupByProduct: true, collectionSlug: "featured" }) {
        items {
          productId
          productName
          slug
          description
          productAsset {
            preview
          }
          price {
            ... on SinglePrice {
              value
            }
          }
        }
      }
    }
  `;

  const { data } = await vendureApiClient({ query });

  return (
    data?.search?.items?.map((item: any) => ({
      id: item.productId,
      name: item.productName,
      slug: item.slug,
      description: item.description,
      image: item.productAsset?.preview,
      price: item.price?.value ? (item.price.value / 100).toFixed(2) : null
    })) ?? []
  );
}
