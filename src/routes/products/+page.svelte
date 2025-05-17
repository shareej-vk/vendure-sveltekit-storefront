<script lang="ts">
import ProductCard from '$lib/components/plp/ProductCard.svelte';
import { searchResults } from '$lib/services/api-services/search-results/searchResultsApi';
import { onMount } from 'svelte';

let products = $state([]);
let loading = $state(true);
let error = $state('');

import { page } from '$app/stores';
let shopApiResult = '';
let shopApiError = '';

onMount(async () => {
  // Get slug from URL param if present
  let slug = $page.params?.slug;

  // Direct shop-api query for debugging
  const query = `
    query GetProductBySlug($slug: String!) {
      product(slug: $slug) {
        id
        name
        slug
        description
      }
    }
  `;
  const variables = { slug };
  try {
    const res = await fetch('http://localhost:3000/shop-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    });
    const data = await res.json();
    shopApiResult = JSON.stringify(data, null, 2);
  } catch (e) {
    shopApiError = e.message;
  }



});
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">All Products</h1>
  {#if loading}
    <div class="text-center py-10 text-gray-400">Loading...</div>
  {:else if error}
    <div class="text-center py-10 text-red-500">{error}</div>
  {:else if products.length === 0}
    <div class="text-center py-10 text-gray-400">No products found.</div>
  {:else}
    <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {#each products as product}
        <a href={`/products/${product.slug}`}>
          <ProductCard {product} />
        </a>
      {/each}
    </section>
  {/if}
</div>

<style>
/* Add any additional styles if needed */
</style>
