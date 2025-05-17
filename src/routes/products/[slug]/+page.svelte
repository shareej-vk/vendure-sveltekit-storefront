<script lang="ts">
import { getWishlistStore } from '$lib/stores/wishlistStore.svelte';
import { getUserStore } from '$lib/stores/user.store.svelte';
import { getCartStore } from '$lib/stores/cartStore.svelte';
import { getCartToastStore } from '$lib/stores/cartToastStore.svelte';
import { getAppUiStore } from '$lib/stores/appUiStore.svelte';
import { addToCart } from '$lib/effects/cartEffects';
import { toggleWishlist } from '$lib/effects/wishlistEffects';

const wishlist = getWishlistStore();
let { data } = $props();
let product = $state(data.product);
let error = $state(data.error);
let loading = $state(data.loading);
const userStore = getUserStore();
let addCartSuccess = $state(false);
const cart = getCartStore();
const cartToast = getCartToastStore();

async function handleWishlist() {
  if (!userStore.user) {
    alert('Login to use wishlist');
    return;
  }
  await toggleWishlist(product.id, wishlist);
}


async function handleAddToCart() {
  if (!product || !product.variants || !product.variants[0]) return;
  try {
    await addToCart(product.variants[0].id, cart);
    cartToast.show(product.featuredAsset?.preview, product.name);
    addCartSuccess = true;
    setTimeout(() => addCartSuccess = false, 1200);
  } catch (error) {
    console.error('Failed to add to cart:', error);
    alert('Failed to add to cart. Please try again.');
  }
}


</script>


<div class="max-w-3xl mx-auto px-4 py-10">
  {#if loading}
    <div class="text-center py-10 text-gray-400">Loading...</div>
  {:else if error}
    <div class="text-center py-10 text-red-500">{error}</div>
  {:else if product}
    <div class="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-10 border border-gray-100">
      <div class="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
        {#if product.featuredAsset?.preview}
          <img src={product.featuredAsset.preview} alt={product.name} class="object-contain w-full h-80 rounded-xl" />
        {:else}
          <div class="w-full h-80 flex items-center justify-center text-gray-400">No image</div>
        {/if}
      </div>
      <div class="flex-1 flex flex-col gap-6">
        <h1 class="text-3xl font-bold mb-2 text-gray-900">{product.name}</h1>
        <div class="text-2xl text-indigo-700 font-bold mb-2">
          {#if product.variants && product.variants[0]?.price}
            ₹{(product.variants[0].price/100).toFixed(2)}
          {:else if product.variants && product.variants[0]?.priceWithTax}
            ₹{(product.variants[0].priceWithTax/100).toFixed(2)}
          {:else}
            <span class="text-gray-400">Price on request</span>
          {/if}
        </div>
        <div class="text-gray-600 text-base mb-4 leading-relaxed">{product.description}</div>
        <div class="flex gap-4 mt-2">
          <button class="flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow transition disabled:opacity-60" onclick={handleAddToCart} disabled={addCartSuccess}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.52 17h8.96a1 1 0 00.87-1.47L17 13M7 13V6a1 1 0 011-1h6a1 1 0 011 1v7" /></svg>
            {addCartSuccess ? 'Added!' : 'Add to Cart'}
          </button>
          <button class="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-50 font-semibold text-lg shadow transition" onclick={handleWishlist} aria-label="Add to Wishlist">
            {#if wishlist.items.includes(product.id)}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              In Wishlist
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
              Add to Wishlist
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
.bg-white {
  background: #fff;
}
.shadow-xl {
  box-shadow: 0 8px 32px 0 rgba(60, 72, 100, 0.18);
}
.rounded-2xl {
  border-radius: 1.25rem;
}
button {
  cursor: pointer;
}
button[disabled] {
  cursor: not-allowed;
}
</style>
