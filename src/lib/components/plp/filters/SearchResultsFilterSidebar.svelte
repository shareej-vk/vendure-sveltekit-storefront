<script lang="ts">
// Svelte 5 SearchResultsFilterSidebar component for product facets
let { facetStore, onReset } = $props();
// Number of filters applied
let filtersApplied = $derived.by(() => facetStore.selected.length);
</script>

<aside class="w-64 bg-white rounded-xl shadow p-6 sticky top-4 self-start h-fit">
  <div class="flex items-center justify-between mb-4">
  <div class="flex items-center gap-2">
    <h2 class="text-lg font-bold text-gray-700">Filters</h2>
    {#if filtersApplied > 0}
      <span class="bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 text-xs font-semibold ml-1">{filtersApplied} applied</span>
    {/if}
  </div>
  {#if filtersApplied > 0}
    <button class="ml-2 px-3 py-1 text-xs rounded bg-gray-100 hover:bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 transition" onclick={onReset}>
      Reset
    </button>
  {/if}
</div>
  <div class="space-y-6">
    {#each facetStore.groupedFacets as group}
      <div>
        <h3 class="font-semibold text-gray-900 text-base mb-2">{group.facetName}</h3>
        <ul class="space-y-1">
          {#each group.values as facet}
            <li>
              <label class="flex items-center space-x-2 rounded px-1 py-1 {facet.count === 0 && !facet.selected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}">
                <input
                  type="checkbox"
                  checked={facet.selected}
                  onclick={() => facet.count === 0 && !facet.selected ? null : facetStore.toggle(facet.id)}
                  class="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  disabled={facet.count === 0 && !facet.selected}
                />
                <span class="{facet.count === 0 && !facet.selected ? 'text-gray-400' : 'text-gray-800'}">{facet.name}</span>
                <span class="text-xs text-gray-400">({facet.count})</span>
              </label>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</aside>
