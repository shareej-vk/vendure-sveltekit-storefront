<script lang="ts">
import { goto } from '$app/navigation';
import SearchInput from './SearchInput.svelte';
let query = $state('');
type SearchResult = {
  productAsset?: { preview?: string };
  productName?: string;
  slug?: string;
  priceWithTax?: any;
};
let results = $state<SearchResult[]>([]);
let isLoading = $state(false);
let isOpen = $state(false);
let selectedIndex = $state(-1);
let searchInput: HTMLDivElement;
let searchInputComponent: any;
let timeoutId: any;

async function searchProducts() {
  const searchTerm = query.trim();
  if (!searchTerm) {
    results = [];
    isOpen = false;
    return;
  }
  isLoading = true;
  isOpen = true;
  try {
    const { searchProducts } = await import('$lib/services/api-services/search/searchApi');
    const result = await searchProducts({ query: searchTerm });
    const items = Array.isArray(result.items) ? result.items : [];
    results = items;
    selectedIndex = -1;
  } catch (error) {
    results = [];
    isOpen = false;
  } finally {
    isLoading = false;
  }
}
function handleInput(event: Event) {
  if (timeoutId) clearTimeout(timeoutId);
  const val = (event.target as HTMLInputElement).value;
  query = val;
  if (query.trim()) {
    isOpen = true;
    timeoutId = setTimeout(searchProducts, 300);
  } else {
    results = [];
    isOpen = false;
  }
}
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
    scrollSelectedIntoView();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, -1);
    scrollSelectedIntoView();
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < results.length) {
      selectResult(results[selectedIndex]);
    } else if (query.trim()) {
      handleSearch();
    }
  } else if (event.key === 'Escape') {
    isOpen = false;
  }
}
function scrollSelectedIntoView() {
  if (selectedIndex >= 0) {
    const selectedElement = searchInput?.querySelector(`[data-result-index="${selectedIndex}"]`);
    selectedElement?.scrollIntoView({ block: 'nearest' });
  }
}
function handleSearch() {
  if (query.trim()) {
    goto(`/search?q=${encodeURIComponent(query)}`);
    isOpen = false;
  }
}
function selectResult(result: any) {
  if (!result) return;
  goto(`/products/${result.slug}`);
  isOpen = false;
  query = '';
  results = [];
}
function handleFocus() {
  isOpen = true;
  if (query.trim()) {
    searchProducts();
  }
}
function formatPrice(price: any) {
  if (!price) return '';
  if (typeof price === 'number') return `$${(price / 100).toFixed(2)}`;
  if (price.value) return `$${(price.value / 100).toFixed(2)}`;
  if (price.min !== undefined && price.max !== undefined) return `$${(price.min / 100).toFixed(2)} - $${(price.max / 100).toFixed(2)}`;
  return '';
}
</script>
<div class="search-container relative w-full max-w-4xl" bind:this={searchInput}>
  <SearchInput
    bind:this={searchInputComponent}
    value={query}
    placeholder="Search products..."
    fullWidth={true}
    ariaExpanded={isOpen}
    ariaControls="search-results-list"
    oninput={handleInput}
    onfocus={handleFocus}
    onkeydown={handleKeyDown}
    onblur={() => { isOpen = false; }}
    onclear={() => { query = ''; results = []; isOpen = false; }}
  />
  {#if isOpen}
    <div class="absolute left-0 z-20 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg max-h-80 overflow-y-auto" id="search-results-list">
      {#if isLoading}
        <div class="p-4 text-gray-500">Loading...</div>
      {:else if results.length === 0 && query.trim()}
        <div class="p-4 text-gray-500">No results found</div>
      {:else}
        {#each results as result, i}
          <div
            class="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 {selectedIndex === i ? 'bg-gray-100' : ''} {i < results.length - 1 ? 'border-b border-gray-200' : ''}"
            data-result-index={i}
            role="option"
            tabindex="0"
            aria-selected={selectedIndex === i}
            onclick={() => selectResult(result)}
            onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectResult(result); }}
          >
            <img src={result.productAsset?.preview} alt={result.productName} class="w-10 h-10 object-cover rounded mr-3" />
            <div class="flex-1">
              <div class="font-medium">{result.productName}</div>
              <div class="text-xs text-gray-500">{formatPrice(result.priceWithTax)}</div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>
<style>
.search-container { position: relative; display: inline-block; width: 100%; }
</style>
