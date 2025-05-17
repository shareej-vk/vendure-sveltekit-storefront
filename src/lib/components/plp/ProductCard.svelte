<script lang="ts">
  import type { Product } from '$lib/services/api-services/plp/types';
  import { getWishlistStore } from '$lib/stores/wishlistStore.svelte';
  import type { WishlistStore } from '$lib/stores/wishlistStore.svelte';
  import { getUserStore } from '$lib/stores/user.store.svelte';
  import type { UserStore } from '$lib/stores/user.store.svelte';
  import { goto } from '$app/navigation';

  let { product, onAddToCart, onWishlist, onQuickView } = $props();
  const wishlist: WishlistStore = getWishlistStore();
  const userStore: UserStore = getUserStore();
  console.log(wishlist.items)

  function handleCardClick(event: MouseEvent) {
    // Prevent navigation if a button inside the card was clicked
    if ((event.target as HTMLElement).closest('button')) return;
    if (product?.slug) goto(`/products/${product.slug}`);
  }
</script>

<div class="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col h-full cursor-pointer items-stretch relative border border-gray-100" onclick={handleCardClick}>
  <!-- Product Image & Badge -->
  <div class="relative mb-4 overflow-hidden rounded-lg aspect-w-1 aspect-h-1 bg-gray-50 flex items-center justify-center">
    {#if product.productAsset?.preview}
      <img src={product.productAsset.preview} alt={product.productName} class="object-contain w-full h-40 group-hover:scale-105 transition-transform duration-200" loading="lazy" />
    {:else}
      <div class="w-full h-40 flex items-center justify-center text-gray-400">No image</div>
    {/if}
    {#if Math.random() > 0.7}
      <span class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded shadow">New</span>
    {/if}
  </div>
  <!-- Product Info -->
  <div class="flex-1 flex flex-col justify-between">
    <h3 class="text-base font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2.5em]">{product.productName}</h3>
    {#if product.description}
      <p class="text-gray-500 text-xs mb-2 line-clamp-2 min-h-[2.5em]">{product.description}</p>
    {/if}
    <div class="flex items-center justify-between mb-2 gap-2">
      <div class="text-indigo-700 font-bold text-lg">
        {#if product.price?.value}
          ₹{(product.price.value/100).toFixed(2)}
        {:else if product.price?.min}
          ₹{(product.price.min/100).toFixed(2)} - ₹{(product.price.max/100).toFixed(2)}
        {:else}
          <span class="text-gray-400">Price on request</span>
        {/if}
      </div>
    </div>
  </div>
  <!-- Actions -->
  <div class="flex gap-2 mt-auto">
    <button class="p-2 rounded-full transition cursor-pointer {wishlist.has(product.productId) ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-gray-100'}" title="Add to Wishlist" onclick={() => {
      if (!userStore.user) {
        alert('This feature works only for logged-in users.');
        return;
      }
      onWishlist(product);
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        class:text-white={wishlist.has(product.productId)} class:text-red-500={wishlist.has(product.productId)} class:text-gray-400={!wishlist.has(product.productId)}>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
      </svg>
    </button>
    <button class="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer" title="Quick View" onclick={() => onQuickView(product)}>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-7 9-9 9s-9-4-9-9 7-9 9-9 9 4 9 9z" />
      </svg>
    </button>
    <button class="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-xs flex-1 cursor-pointer" onclick={() => onAddToCart(product)}>
      Add to Cart
    </button>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
