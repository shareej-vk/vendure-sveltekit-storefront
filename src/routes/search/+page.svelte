<script lang="ts">
import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
import SearchResultsFilterSidebar from '$lib/components/plp/filters/SearchResultsFilterSidebar.svelte';
import QuickView from '$lib/components/plp/QuickView.svelte';
import ProductCard from '$lib/components/plp/ProductCard.svelte';
import { getCartStore } from '$lib/stores/cartStore.svelte';
import { getCartToastStore } from '$lib/stores/cartToastStore.svelte';
import { addToCartApi } from '$lib/services/api-services/cart/cartApi';
import { createFacetStore } from '$lib/stores/facetStore.svelte';
import { searchResults } from '$lib/services/api-services/search-results/searchResultsApi';
import { onMount } from 'svelte';
import { page } from '$app/stores';
import {browser} from '$app/environment';
import { goto } from '$app/navigation';
import { toggleWishlist } from '$lib/effects/wishlistEffects';
import type { Product } from '$lib/services/api-services/plp/types';

let { data } = $props();
let quickViewProduct = $state<Product | null>(null);
let loading = $state(false);
let error = $state(data.error ?? '');
let results = $state<Product[]>(data.results ?? []);
let totalItems = $state(data.totalItems ?? 0);
let facets = $state(data.filteredFacets ?? []);
let currentPage = $state(data.page ?? 1);
let pageSize = data.pageSize ?? 12;

// Facet store setup (robust merge logic)
const facetStore = createFacetStore();
facetStore.updateAll(data.filteredFacets ?? []);
facetStore.setFilteredCounts((data.filteredFacets ?? []).map((f: any) => ({ id: f.id, count: f.count })));

// Hydrate selected facets from URL on initial load (frontend only)
if (typeof window !== 'undefined') {
  const url = new URL(window.location.href);
  const selectedFacets = (url.searchParams.get('facets') || '').split(',').filter(Boolean);
  facetStore.setSelected(selectedFacets);
}

console.log('[SSR] facetStore:', data.filteredFacets);
const cart = getCartStore();
const cartToast = getCartToastStore();
function handleAddToCart(product: Product) {
  if (product?.slug) goto(`/products/${product.slug}`);
}
import { getWishlistStore } from '$lib/stores/wishlistStore.svelte';
const wishlist = getWishlistStore();
function handleWishlist(product: Product) {
  toggleWishlist(product, wishlist);
}
function handleQuickView(product: Product) {
  quickViewProduct = product;
}
function onReset() {
  facetStore.reset();
}

function groupFacets(facetValues: any) {
 let flatFacets = facetValues.map((f: any) => ({
      ...f.facetValue,
      count: f.count,
      facetName: f.facetValue.facet?.name || 'Other'
    }));
  return flatFacets;
}

let serarchQuery = $derived.by(() => $page.url.searchParams.get('q') || '');
let firstRun = true;
async function getSearchResults(selectedFacets:string[]){ 
  loading = true;
    error = '';   
    try {
      const res = await searchResults({
        query: serarchQuery,
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        categoryIds: selectedFacets,
        fetch: window.fetch
      });
      results = res.items;
      totalItems = res.totalItems;      
      facetStore.updateAll(data.filteredFacets);         
      facetStore.setFilteredCounts(data.filteredFacets);  
    
     } catch (e) {
      error = 'Search failed';
    }
    loading = false;


}

$effect(() => {
    if (firstRun) {
        facetStore.selected;
        firstRun = false;
        return;
    }
    const selectedFacets = facetStore.selected;
    const url = new URL(window.location.href);
    url.searchParams.delete('facets');
    url.searchParams.set('facets', selectedFacets.join(','));
    if (url.toString() !== window.location.href) {
        history.replaceState({}, '', url.pathname + url.search);
    }
    getSearchResults(selectedFacets);
});

$effect(() => {
    if (firstRun) {
        facetStore.selected;
        firstRun = false;
        return;
    }
    serarchQuery
  
  
  })



</script>

<div class="w-full py-2 mb-0 flex items-center">
  <div class="mx-auto max-w-7xl px-2 sm:px-3 lg:px-4 w-full flex items-center">
    <Breadcrumbs segments={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
  </div>
</div>
<div class="w-full bg-gray-100 py-6 mt-0 mb-4">
  <div class="mx-auto max-w-7xl px-2 sm:px-3 lg:px-4">
    <h2 class="text-2xl font-semibold text-center text-slate-500">Showing {totalItems} results</h2>
  </div>
</div>
<div class="flex w-full min-h-screen bg-gray-50">
  <!-- Sidebar: Facet Filters -->
  <SearchResultsFilterSidebar {facetStore} onReset={onReset} />
  <!-- Main: Search Results -->
  <main class="flex-1 flex flex-col gap-8 bg-white">
    {#if loading}
      <div class="text-center py-10 text-gray-500">Loading...</div>
    {:else if error}
      <div class="text-center py-10 text-red-500">{error}</div>
    {:else}
      <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4 bg-white rounded-xl">
        {#each results as product}
          <ProductCard
            {product}
            onAddToCart={handleAddToCart}
            onWishlist={handleWishlist}
            onQuickView={handleQuickView}
          />
        {/each}
      </section>
    {/if}
  </main>
  {#if quickViewProduct}
    <QuickView product={quickViewProduct} onClose={() => quickViewProduct = null} onWishlist={handleWishlist} />
  {/if}
</div>
