// Svelte 5 facet filter store (runes-class-context pattern)
import { setContext, getContext } from 'svelte';

const FacetStoreKey = Symbol('FacetStore');

export type FacetValue = {
  id: string;
  name: string;
  count: number;
  facetId?: string;
  facetName?: string;
};

export class FacetStore {
  _allSet = false;
  selected = $state<string[]>([]); // selected facet value IDs
  allFacets = $state<FacetValue[]>([]); // all available facet values (merged, always visible)
  /**
   * Always show all available facets, but update their count and selected status based on latest filter results.
   * If a facet is not present in the filtered result, keep its count as 0.
   */
  filteredCounts = $state<Record<string, number>>({});

  /**
   * Always show all available facets, but update their count and selected status based on latest filter results.
   * If a facet is not present in the filtered result, set its count to 0.
   */
  filteredFacets = $derived.by(() => {
    return this.allFacets.map(f => ({
      ...f,
      selected: this.selected.includes(f.id),
      count: this.filteredCounts[f.id] ?? 0
    }));
  });

  setFilteredCounts(facetCounts: { id: string; count: number }[]) {
    const map: Record<string, number> = {};
    for (const fc of facetCounts) {
      map[fc.id] = fc.count;
    }
    this.filteredCounts = map;
  }

  groupedFacets = $derived.by(() => {
    const groups: Record<string, { facetName: string; values: Array<FacetValue & { selected: boolean }> }> = {};
    this.filteredFacets.forEach(facet => {
      const name = facet.facetName || 'Other';
      if (!groups[name]) {
        groups[name] = { facetName: name, values: [] };
      }
      groups[name].values.push(facet);
    });
    return Object.values(groups);
  });

  updateAll(facets: FacetValue[]) {
   console.log('FacetStore.updateAll facets: FOR THE ', facets);
    // Always assign a new array to trigger reactivity
    this.allFacets = [...facets];
    // Debug log
    console.log('FacetStore.updateAll assigned allFacets:', this.allFacets);
  }

  toggle(facetId: string) {
    if (this.selected.includes(facetId)) {
      this.selected = this.selected.filter(id => id !== facetId);
    } else {
      this.selected = [...this.selected, facetId];
    }
  }

  reset() {
    this.selected = [];
  }

  setSelected(ids: string[]) {
    this.selected = [...ids];
  }
}

export function createFacetStore() {
  const store = new FacetStore();
  setContext(FacetStoreKey, store);
  return store;
}

export function getFacetStore(): FacetStore {
  return getContext(FacetStoreKey);
}
