import { searchResults } from '$lib/services/api-services/search-results/searchResultsApi';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {

  // Get query params from the URL
  const q = url.searchParams.get('q') || '';
  const page = Number(url.searchParams.get('page') || 1);
  const pageSize = Number(url.searchParams.get('pageSize') || 12);
  // Parse selected facets from URL for SSR hydration
  const facetsParam = url.searchParams.get('facets') || '';
  const selectedFacets = facetsParam.split(',').filter(Boolean);
  // Use selectedFacets (from 'facets' param) for filtering
  const categoryIds = [];

  try {
    // Fetch filtered facets for the current query
    const res = await searchResults({
      query: q,
      skip: (page - 1) * pageSize,
      take: pageSize,
      categoryIds,
      fetch
    });
    const filteredFacets = res.facetValues.map((f: any) => ({
      ...f.facetValue,
      count: f.count,
      facetName: f.facetValue.facet?.name || 'Other'
    }));

    // Fetch all possible facets (unfiltered)
    const allRes = await searchResults({
      query: '',
      skip: 0,
      take: 1,
      categoryIds: [],
      fetch
    });
    // Robust facet merging: ensure all possible facet values always show, with correct counts
    const facetValueMap: Record<string, any> = {};
    // Add all unfiltered (blank search) facet values
    for (const f of allRes.facetValues) {
      facetValueMap[f.facetValue.id] = {
        ...f.facetValue,
        count: f.count,
        facetName: f.facetValue.facet?.name || 'Other'
      };
    }
    // Add/update any filtered facet values (selected or present in results)
    for (const f of res.facetValues) {
      facetValueMap[f.facetValue.id] = {
        ...f.facetValue,
        count: f.count,
        facetName: f.facetValue.facet?.name || 'Other'
      };
    }
    const allFacets = Object.values(facetValueMap);

    // Return all necessary data for the page
    return {
      results: res.items,
      totalItems: res.totalItems,
      filteredFacets,
      allFacets,
      selectedFacets, // SSR-selected facets for hydration
      error: null,
      page,
      pageSize,
      q,
      categoryIds
    };

  } catch (e) {
    return {
      results: [],
      totalItems: 0,
      facets: [],
      error: 'Search failed',
      page,
      pageSize,
      q,
      categoryIds
    };
  }
};
