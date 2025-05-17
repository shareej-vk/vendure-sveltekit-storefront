<script lang="ts">
  let {data} = $props();
  console.log(">>FROM CLIENT",data)
import ProductCard from '$lib/components/plp/ProductCard.svelte';
import { getCartStore } from '$lib/stores/cartStore.svelte';
import { getCartToastStore } from '$lib/stores/cartToastStore.svelte';
import { addToCartApi } from '$lib/services/api-services/cart/cartApi';
let showMobileFilters = $state(false);
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import FilterSidebar from '$lib/components/plp/filters/FilterSidebar.svelte';
import MobileFilterButton from '$lib/components/plp/filters/MobileFilterButton.svelte';
import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
import QuickView from '$lib/components/plp/QuickView.svelte';
import { getWishlistStore } from '$lib/stores/wishlistStore.svelte';
import { getProductsByCollection, getCollectionFacets } from '$lib/services/api-services/plp/productListingApi';
import type { Product, Collection, FacetValue, FacetCount, ProductSearchResult } from '$lib/services/api-services/plp/types';
import { toggleWishlist } from '$lib/effects/wishlistEffects';

// Product card handlers
const cart = getCartStore();
const cartToast = getCartToastStore();
function handleAddToCart(product: Product) {
  if (product?.slug) goto(`/products/${product.slug}`);
}
const wishlist = getWishlistStore();
async function handleWishlist(product: Product) {
  try {
    await toggleWishlist(product.productId, wishlist);
  } catch (error) {
    console.error('Failed to toggle wishlist:', error);
    alert('Failed to update wishlist. Please try again.');
  }
}
function handleQuickView(product: Product) { 
  quickViewProduct = product;
}

let quickViewProduct = $state<Product | null>(null);

let products = $state<Product[]>(data?.products ?? []);
let facets = $state<Record<string, { facetValue: FacetValue; count: number }[]>>(data?.allFacets ?? {});
let isLoading = $state(false);
let error = $state<string|null>(data?.error ?? null);
let allFacets = $state<Record<string, { facetValue: FacetValue; count: number }[]>>(data?.allFacets ?? {});
console.log('[SSR] data?.allFacets:', data?.allFacets);
let currentPage = $state(1);
let totalPages = $state(data?.totalPages ?? 1);
const ITEMS_PER_PAGE = 6;

let collectionSlug = $derived(() => $page.params.slug);

// Fetch all possible facet values for the collection (unfiltered)
$effect(async () => {
  const slug = collectionSlug();
  if (!slug) return;
  const allFacetValues = await getCollectionFacets(slug);
  console.log('[CLIENT] allFacetValues:', allFacetValues);
  // Group all facet values by facetId
  const grouped = {};
  allFacetValues.forEach(fv => {
    const facetId = fv.facet?.id;
    if (!facetId) return;
    if (!grouped[facetId]) grouped[facetId] = [];
    grouped[facetId].push({
      facetValue: fv,
      count: 0 // Will be replaced by filtered count if present
    });
  });
  console.log('[CLIENT] grouped:', grouped);
  allFacets = grouped;
  console.log('[CLIENT] allFacets after assignment:', allFacets);
});
let currentFacetValueIds = $derived(() => {
  const param = $page.url.searchParams.get('categories');
  return param ? param.split(',').filter(Boolean) : [];
});

let urlPage = $derived(() => {
  const param = $page.url.searchParams.get('page');
  const n = param ? parseInt(param, 10) : 1;
  return isNaN(n) ? 1 : n;
});

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

let sortOrder = $derived(() => $page.url.searchParams.get('sort') || 'newest');

let collection = $state<Collection|null>(data?.collection ?? null);

async function loadCollection(slug: string, facetIds: string[], pageNum: number = 1, sort: string = 'newest') {
  isLoading = true;
  try {
    const data = await getProductsByCollection(slug, pageNum, ITEMS_PER_PAGE, facetIds, undefined, undefined, undefined, sort);
    collection = data.collection ?? null;
    products = Array.isArray(data.products?.items) ? data.products.items : [];
    totalPages = Math.max(1, Math.ceil((data.products?.totalItems ?? 0) / ITEMS_PER_PAGE));
    // Only show facets present in the current product list
    const productFacetValueIds = new Set();
    products.forEach(p => {
      if (Array.isArray(p.facetValueIds)) {
        p.facetValueIds.forEach(id => productFacetValueIds.add(id));
      }
    });
    // Merge allFacets and filtered facets
    facets = {};
    // Build a map of filtered facet counts
    const filteredCounts = {};
    if (Array.isArray(data.products?.facetValues)) {
      data.products.facetValues.forEach(fv => {
        filteredCounts[fv.facetValue.id] = fv.count;
      });
    }
    // Merge: for each possible facet value, use filtered count if present, else 0
    Object.entries(allFacets).forEach(([facetId, values]) => {
      facets[facetId] = values.map(({ facetValue }) => ({
        facetValue,
        count: filteredCounts[facetValue.id] ?? 0
      }));
    });
    error = null;
  } catch (e) {
    error = 'Failed to load collection.';
  } finally {
    isLoading = false;
  }
}

// Only update currentPage on navigation, don't fetch on SSR hydration
$effect(() => {
  const pageNum = urlPage();
  currentPage = pageNum;
});

function facetChange(facetId, valueId) {
  const url = new URL(window.location.href);
  let ids = url.searchParams.get('categories')?.split(',').filter(Boolean) || [];
  if (ids.includes(valueId)) {
    ids = ids.filter(id => id !== valueId);
  } else {
    ids.push(valueId);
  }
  url.searchParams.set('categories', ids.join(','));
  url.searchParams.set('page', '1'); // Reset to first page on facet change
  goto(url.pathname + url.search, { replaceState: true, noScroll: true });

  // Only call loadCollection on client filter change
  const slug = collectionSlug();
  const facetIds = ids;
  const pageNum = 1;
  const sort = sortOrder();
  loadCollection(slug, facetIds, pageNum, sort);
}

function goToPage(pageNum: number) {
  const url = new URL(window.location.href);
  url.searchParams.set('page', pageNum.toString());
  goto(url.pathname + url.search, { replaceState: true, noScroll: true });

  // Client-side pagination: fetch new data
  const slug = collectionSlug();
  const facetIds = currentFacetValueIds();
  const sort = sortOrder();
  loadCollection(slug, facetIds, pageNum, sort);
}

function onSortChange(e) {
  const url = new URL(window.location.href);
  url.searchParams.set('sort', e.target.value);
  url.searchParams.set('page', '1'); // Reset to first page on sort
  goto(url.pathname + url.search, { replaceState: true, noScroll: true });

  // Client-side sort: fetch new data
  const slug = collectionSlug();
  const facetIds = currentFacetValueIds();
  const pageNum = 1;
  const sort = e.target.value;
  loadCollection(slug, facetIds, pageNum, sort);
}

</script>

<div class="mx-auto max-w-7xl px-2 py-4 sm:px-3 lg:px-4">
  <!-- Breadcrumbs -->
  <Breadcrumbs segments={[
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    collection ? { label: collection.name } : { label: '...' }
  ]} />
  <!-- Collection header -->
  {#if collection}
    <div class="w-full bg-gray-100 py-6 mb-4">
      <h1 class="text-4xl font-bold text-center text-slate-500">{collection.name}</h1>
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
    <!-- Sidebar -->
    <aside class="hidden lg:block">
      <div class="bg-white rounded shadow p-4">
        <FilterSidebar {facets} currentFacetValueIds={currentFacetValueIds()} facetChange={facetChange} onReset={() => {
  // Reset all filters
  const allIds = currentFacetValueIds();
  allIds.forEach(id => facetChange(undefined, id));
}} />
      </div>
    </aside>
    <!-- Mobile Filter Modal -->
    {#if showMobileFilters}
      <div class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-end lg:hidden">
        <div class="w-full bg-white rounded-t-xl p-4 max-h-[80vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Filters</h2>
            <button class="text-gray-500 text-2xl" onclick={() => showMobileFilters = false} aria-label="Close">&times;</button>
          </div>
          <FilterSidebar {facets} currentFacetValueIds={currentFacetValueIds()} facetChange={(facetId, valueId) => { facetChange(facetId, valueId); showMobileFilters = false; }} onReset={() => {
  const allIds = currentFacetValueIds();
  allIds.forEach(id => facetChange(undefined, id));
}} />
        </div>
      </div>
    {/if}
    <!-- Main content -->
    <main class="lg:col-span-3">
      <div class="flex items-center mb-4">
        <MobileFilterButton onClick={() => showMobileFilters = true} />
        <!-- Sort dropdown -->
        <div style="z-index:0;" class="flex justify-end items-center mb-4 lg:sticky lg:top-0 lg:bg-white lg:z-30 lg:py-2 lg:shadow-sm">
          <label for="sort" class="mr-2 text-sm text-gray-600">Sort by:</label>
          <select id="sort" class="border rounded px-2 py-1 text-sm" value={sortOrder()} onchange={onSortChange}>
            {#each SORT_OPTIONS as opt}
              <option value={opt.value} selected={sortOrder() === opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>
      </div>
      {#if isLoading}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {#each Array(8) as _, i}
            <div class="bg-white rounded shadow p-4 flex flex-col animate-pulse">
              <div class="h-32 bg-gray-200 rounded mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div class="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
              <div class="h-8 bg-gray-100 rounded w-full"></div>
            </div>
          {/each}
        </div>
      {:else if products.length === 0}
        <div class="text-center text-gray-500 py-16">No products found in this collection.</div>
      {:else}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {#each products as product (product.productId)}
            <ProductCard
              {product}
              onAddToCart={handleAddToCart}
              onWishlist={handleWishlist}
              onQuickView={handleQuickView}
            />
          {/each}
        </div>
      {:else if error}
        <div class="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      {:else}
        {#if products.length === 0}
          <div class="text-center text-gray-500 py-12">No products found.</div>
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {#each products as product}
              <ProductCard
                {product}
                onAddToCart={handleAddToCart}
                onWishlist={handleWishlist}
                onQuickView={handleQuickView}
              />
            {/each}
          </div>
        {/if}
      {/if}
    </main>
  </div>

  <QuickView product={quickViewProduct} onClose={() => quickViewProduct = null} onWishlist={handleWishlist} />

  {#if totalPages > 1}
    <div class="flex justify-center mt-12 mb-8">
      <nav class="inline-flex -space-x-px" aria-label="Pagination">
        <button class="px-3 py-1 rounded-l border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          onclick={() => goToPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>&laquo; Prev</button>
        {#each Array(totalPages) as _, i}
          <button class="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-indigo-50 font-medium {currentPage === i+1 ? 'bg-indigo-100 text-indigo-700' : ''}"
            onclick={() => goToPage(i+1)} disabled={currentPage === i+1}>{i+1}</button>
        {/each}
        <button class="px-3 py-1 rounded-r border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          onclick={() => goToPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next &raquo;</button>
      </nav>
    </div>
  {/if}
</div>
