import { getProductsByCollection, getCollectionFacets } from '$lib/services/api-services/plp/productListingApi';

export async function load({ params, url, fetch }) {
    console.log(">>FROM SERVER",params,url,fetch)
  const slug = params.slug;
  const facetIds = url.searchParams.get('categories')?.split(',').filter(Boolean) ?? [];
  const pageNum = Number(url.searchParams.get('page') ?? 1);
  const sort = url.searchParams.get('sort') ?? 'newest';
    let error = null;
    let collection = null;
    let products: any[] = [];
    let totalPages = 1;
    let facets: Record<string, { facetValue: any; count: number }[]> = {};
    try {
      const data = await getProductsByCollection(slug, pageNum, 12, facetIds, undefined, undefined, fetch, sort);
      collection = data.collection ?? null;
      products = Array.isArray(data.products?.items) ? data.products.items : [];
      totalPages = Math.max(1, Math.ceil((data.products?.totalItems ?? 0) / 12));
      // Only show facets present in the current product list
      const productFacetValueIds = new Set<string>();
      products.forEach(p => {
        if (Array.isArray(p.facetValueIds)) {
          p.facetValueIds.forEach((id: string) => productFacetValueIds.add(id));
        }
      });
      // Build a map of filtered facet counts
      const filteredCounts: Record<string, number> = {};
      if (Array.isArray(data.products?.facetValues)) {
        data.products.facetValues.forEach((fv: any) => {
          filteredCounts[fv.facetValue.id] = fv.count;
        });
      }
      // SSR: Fetch and group all possible facet values for the collection
      const allFacetValues = await getCollectionFacets(slug, fetch);
      const allFacets: Record<string, { facetValue: any; count: number }[]> = {};
      allFacetValues.forEach((fv: any) => {
        const facetId = fv.facet?.id;
        if (!facetId) return;
        if (!allFacets[facetId]) allFacets[facetId] = [];
        allFacets[facetId].push({ facetValue: fv, count: 0 });
      });
      // Merge filteredCounts into allFacets
      Object.entries(allFacets).forEach(([facetId, values]) => {
        allFacets[facetId] = values.map(({ facetValue }) => ({
          facetValue,
          count: filteredCounts[facetValue.id] ?? 0
        }));
      });
      return {collection, products, totalPages, facets, allFacets, error };
    } catch (e) {
      error = 'Failed to load collection.';
    }
}
