// Wishlist store using runes-class-context pattern, with backend sync
import { setContext, getContext } from 'svelte';

const WISHLIST = Symbol('wishlist');

export class WishlistStore {
  items = $state<string[]>([]);
  loading = $state(false);
  error = $state<string | null>(null);
  success = $state<string | null>(null);

  init(items: string[]) {
    this.items = items;
    this.loading = false;
    this.error = null;
    this.success = 'Wishlist loaded successfully';
  }

  add(productId: string) {
    if (!this.items.includes(productId)) {
      this.items = [...this.items, productId];
      this.loading = false;
      this.error = null;
      this.success = 'Product added to wishlist';
    }
  }

  remove(productId: string) {
    if (this.items.includes(productId)) {
      this.items = this.items.filter(id => id !== productId);
      this.loading = false;
      this.error = null;
      this.success = 'Product removed from wishlist';
    }
  }

  toggle(productId: string) {
    if (this.items.includes(productId)) {
      this.remove(productId);
    } else {
      this.add(productId);
    }
  }

  clear() {
    this.items = [];
    this.loading = false;
    this.error = null;
    this.success = 'Wishlist cleared successfully';
  }

  clearMessages() {
    this.error = null;
    this.success = null;
  }

  has(productId: string) {
    return this.items.includes(productId);
  }
}

export function createWishlistStore() {
  const store = new WishlistStore();
  setContext(WISHLIST, store);
  return store;
}

export function getWishlistStore(): WishlistStore {
  return getContext(WISHLIST);
}
