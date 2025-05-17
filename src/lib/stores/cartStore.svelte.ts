// Cart store using runes-class-context pattern
import { setContext, getContext } from 'svelte';

const CART = Symbol('cart');

export interface CartItem {
  lineId: string; // backend order line id
  productId: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

export class CartStore {
  items = $state<CartItem[]>([]);

  syncFromBackend(lines: Array<any>) {
    this.items = lines.map(line => ({
      lineId: line.id, // order line id from backend
      productId: line.productVariant.id,
      name: line.productVariant.name,
      price: line.unitPriceWithTax ?? line.unitPrice ?? 0,
      image: line.featuredAsset?.preview,
      qty: line.quantity
    }));
  }

  add(item: CartItem) {
    const existing = this.items.find(i => i.productId === item.productId);
    if (existing) {
      existing.qty += item.qty;
    } else {
      this.items.push({ ...item });
    }
  } // add does not set lineId, only used for local cart

  remove(productId: string) {
    this.items = this.items.filter(i => i.productId !== productId);
  }

  updateQty(productId: string, qty: number) {
    const item = this.items.find(i => i.productId === productId);
    if (item && qty > 0) item.qty = qty;
    if (item && qty === 0) this.remove(productId);
  }

  clear() {
    this.items = [];
  }

  get total() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  get count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  }
}

export function createCartStore() {
  const store = new CartStore();
  setContext(CART, store);
  return store;
}

export function getCartStore(): CartStore {
  return getContext(CART);
}
