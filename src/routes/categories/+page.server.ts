import { getCollections } from '$lib/services/api-services/categories/collectionsApi';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const collections = await getCollections(fetch);
  return { collections };
};
