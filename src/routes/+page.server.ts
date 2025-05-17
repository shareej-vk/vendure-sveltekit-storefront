import type { PageLoad } from './$types';
import { featuredProducts } from '$lib/services/api-services/landing/featuredProductsApi';
import { getCollections } from '$lib/services/api-services/categories/collectionsApi';

export const load: PageLoad = async ({ fetch }) => {
  const products = await featuredProducts(fetch);
  const collections = await getCollections(fetch);
  console.log(products, collections , "FROM LANDINGG");
  return { products, collections };
};
