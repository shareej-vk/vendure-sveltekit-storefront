<script lang="ts">
  import ProductCard from '../plp/ProductCard.svelte';
  import { getCartStore } from '$lib/stores/cartStore.svelte';
  import { getCartToastStore } from '$lib/stores/cartToastStore.svelte';
  import { getWishlistStore } from '$lib/stores/wishlistStore.svelte';
  import { addToCartApi } from '$lib/services/api-services/cart/cartApi';
  import QuickView from '../plp/QuickView.svelte';
  import { toggleWishlist } from '$lib/effects/wishlistEffects';
  import { onMount } from 'svelte';
  import type { Product } from '$lib/services/api-services/plp/types';
  import { addToCart } from '$lib/effects/cartEffects';
  const cart = getCartStore();
  const cartToast = getCartToastStore();
  const wishlist = getWishlistStore();

  export let products: Array<any> = [];
  $: mappedProducts = products.map(product => {
  let variants = product.variants;
  // If variants not present but variantId exists, create a variants array
  if (!variants && product.variantId) {
    variants = [{ id: product.variantId }];
  } else if (!variants && product.variants?.length === undefined && product.id) {
    // Fallback: try to use product.id as variant id
    variants = [{ id: product.id }];
  }
  return {
    ...product,
    productAsset: { preview: product.image },
    productName: product.name,
    price: { value: typeof product.price === 'number' ? product.price : parseFloat(product.price) },
    productId: product.productId || product.id,
    slug: product.slug,
    variants
  };
});

 

  let quickViewProduct = null;
  function handleQuickView(product) {
    quickViewProduct = product;
  }
  function handleCloseQuickView() {
    quickViewProduct = null;
  }

  async function handleAddToCart(product: Product) {
    try {
      await addToCart(product.id, cart);
      cartToast.show(product.productAsset?.preview, product.productName);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  }

  import { addProductToWishlist, removeProductFromWishlist } from '$lib/services/api-services/wishlist/wishlistApi';

  async function handleWishlist(product: Product) {
    try {
      await toggleWishlist(product.productId, wishlist);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    }
  }
</script>

<section class="py-12 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="text-2xl font-bold mb-6 text-gray-900">Featured Products</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
  {#each mappedProducts as product (product.id || product.productId)}
  <ProductCard
    {product}
    onAddToCart={handleAddToCart}
    onWishlist={handleWishlist}
    onQuickView={handleQuickView}
  />
{/each}
{#if quickViewProduct}
  <QuickView product={quickViewProduct} onClose={handleCloseQuickView} onWishlist={handleWishlist} />
{/if}
</div>
  </div>
</section>
