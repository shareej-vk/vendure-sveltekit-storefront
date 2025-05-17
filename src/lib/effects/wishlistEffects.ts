import { getWishlistStore } from '$lib/stores/wishlistStore.svelte';
import { addProductToWishlist, removeProductFromWishlist } from '$lib/services/api-services/wishlist/wishlistApi';
import type { Product } from '$lib/services/api-services/plp/types';
import type { WishlistStore } from '$lib/stores/wishlistStore.svelte';



export async function toggleWishlist(productId: string, wishlist: WishlistStore): Promise<void> {
  try {
    if (!productId) {
      throw new Error('Invalid product ID');
    }

    if (wishlist.items.includes(productId)) {
      // Remove from backend first
      await removeProductFromWishlist(productId);
      // Then update store
      wishlist.remove(productId);
    } else {
      // Add to backend first
      await addProductToWishlist(productId);
      // Then update store
      wishlist.add(productId);
    }
  } catch (error) {
    console.error('Failed to update wishlist:', error);
    alert('Failed to update wishlist. Please try again.');
  }
}

