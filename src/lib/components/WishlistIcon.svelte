<script lang="ts">
  import { getWishlistStore } from '$lib/stores/wishlistStore.svelte';
  import type { WishlistStore } from '$lib/stores/wishlistStore.svelte';
  import { getUserStore } from '$lib/stores/user.store.svelte';
  import type { UserStore } from '$lib/stores/user.store.svelte';
  import { getProductsByIds } from '$lib/services/api-services/wishlist/wishlistProductsApi';

  let open = $state(false);
  const wishlist: WishlistStore = getWishlistStore();
  const userStore: UserStore = getUserStore();

  let products = $state<any[]>([]);
  let loadingProducts = $state(false);

  async function loadWishlistProducts() {
    loadingProducts = true;
    products = [];
    console.log('wishlist.items:', wishlist.items);
    if (wishlist.items.length > 0) {
      products = await getProductsByIds(wishlist.items);
      console.log('wishlist products:', products);
    }
    loadingProducts = false;
  }

  $effect(() => {
    if (open) {
      loadWishlistProducts();
    }
  });
</script>

<button class="relative p-2 rounded-full hover:bg-gray-100 text-gray-600" aria-label="Open wishlist" onclick={() => {
  if (!userStore.user) {
    alert('Please log in to view your wishlist.');
    return;
  }
  open = true;
}} disabled={!userStore.user}>
  <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c2.04 0 3.81 1.23 4.5 3.09C12.69 4.23 14.46 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
  {#if wishlist.items.length > 0}
    <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{wishlist.items.length}</span>
  {/if}
</button>

{#if open && userStore.user}
  <div class="fixed inset-0 bg-black/50 z-[2147483647] flex items-center justify-center min-h-screen">
    <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-10 relative" style="min-height: 400px;">
      <button class="absolute top-4 right-4 text-gray-400 hover:text-red-600 cursor-pointer text-4xl font-bold leading-none z-[2147483647]" onclick={() => open = false} aria-label="Close">&times;</button>
      <h2 class="text-xl font-bold mb-4">Wishlist</h2>
      {#if loadingProducts}
        <p class="text-gray-500">Loading wishlist...</p>
      {:else if products.length}
        <ul>
          {#each products as product}
            <li class="py-2 border-b last:border-b-0 flex items-center gap-3">
              {#if product.featuredAsset}
                <img src={product.featuredAsset.preview} alt={product.name} class="w-10 h-10 object-cover rounded" />
              {/if}
              <div class="flex-1">
                <div class="font-semibold">{product.name}</div>
                <div class="text-xs text-gray-400">{product.slug}</div>
              </div>
              <div class="font-bold text-gray-900">
                {product.variants?.[0]?.priceWithTax ? `${product.variants[0].priceWithTax/100} ${product.variants[0].currencyCode}` : ''}
              </div>
              <button class="ml-2 cursor-pointer px-1 py-1 rounded" title="Remove from wishlist" onclick={async () => { await wishlist.remove(product.id); await loadWishlistProducts(); }} aria-label="Remove">
  <svg class="w-4 h-4 text-red-500 hover:text-red-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
</button>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-gray-500">Your wishlist is empty.</p>
      {/if}
    </div>
  </div>
{/if}
