<script lang="ts">
  import type { Product } from '$lib/services/api-services/plp/types';
  let { product = null, onClose, onWishlist } = $props();
  function handleWishlist() {
    if (onWishlist && product) onWishlist(product);
    else if (product) alert(`Added to wishlist: ${product.productName}`);
  }
</script>

{#if product}
  <div class="fixed inset-0 flex items-center justify-center z-50" style="background: rgba(0,0,0,0.4);">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
      <button class="absolute top-4 right-4 text-4xl font-bold text-gray-400 hover:text-red-600 leading-none transition-all p-2 cursor-pointer" onclick={onClose} aria-label="Close">&times;</button>
      {#if product.productAsset?.preview}
        <div class="flex justify-center mb-4">
          <img src={product.productAsset.preview} alt={product.productName} class="object-contain h-40 w-full rounded" />
        </div>
      {/if}
      <h2 class="text-xl font-bold mb-2">{product.productName}</h2>
      <p class="text-gray-600 mb-4">{product.description}</p>
      <div class="text-indigo-700 font-bold text-lg mb-4">
        {#if product.price?.value}
          ₹{(product.price.value/100).toFixed(2)}
        {:else if product.price?.min}
          ₹{(product.price.min/100).toFixed(2)} - ₹{(product.price.max/100).toFixed(2)}
        {:else}
          <span class="text-gray-400">Price on request</span>
        {/if}
      </div>
      <button class="w-full mt-2 py-2 px-4 rounded bg-pink-500 text-white font-semibold hover:bg-pink-600 transition" onclick={handleWishlist}>
        Add to Wishlist
      </button>
    </div>
  </div>
{/if}

<style>
  /* Only for fallback, use Tailwind for main styling */
</style>
