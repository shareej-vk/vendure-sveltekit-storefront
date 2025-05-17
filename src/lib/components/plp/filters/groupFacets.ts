// Utility to group flat facetValues array (from search API) into grouped facets for sidebar
// Utility to group flat facetValues array (from search API) into grouped facets for sidebar
// By default, group by facetId for filtering, but always include groupName for display
// Optionally, can group by facet name for legacy support
export function groupFacets(facetValues, groupBy = 'id') {
  const grouped = {};
  if (!Array.isArray(facetValues)) return grouped;
  facetValues.forEach(fv => {
    const facetId = fv.facet?.id;
    const groupName = fv.facet?.name;
    if (!facetId || !groupName) return;
    const groupKey = groupBy === 'name' ? groupName : facetId;
    if (!grouped[groupKey]) grouped[groupKey] = [];
    grouped[groupKey].push({
      facetValue: fv,
      count: fv.count ?? 0,
      groupName
    });
  });
  return grouped;
}

