import type { PageServerLoad } from './$types';
import { getProductBySlug } from '$lib/services/api-services/products/getProductBySlug';
export const load: PageServerLoad = async ({ params, fetch }) => {
  let product = null;
  let error = '';
  let loading = true;
  console.log('[SSR] Loading product for slug:', params.slug);
  try {
    product = await getProductBySlug(params.slug, fetch);
    console.log('[SSR] Product fetched:', product);
    if (!product) error = 'Product not found';
  } catch (e) {
    error = 'Failed to load product';
    console.error('[SSR] Error loading product:', e);
  }
  loading = false;
  return {  product, error, loading  };
};
