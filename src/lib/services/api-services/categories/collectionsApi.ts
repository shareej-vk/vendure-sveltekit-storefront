import { vendureApiClient } from '$lib/services/api-services/vendureApiClient';

export async function getCollections(fetch?: typeof globalThis.fetch, take: number = 20) {
  const query = `
    query GetCollections($take: Int!) {
      collections(options: { take: $take, sort: { name: ASC } }) {
        items {
          id
          name
          slug
          featuredAsset {
            preview
          }
        }
      }
    }
  `;
  const variables = { take };
  const { data } = await vendureApiClient({ query, variables, fetch });
  return data?.collections?.items ?? [];
}
