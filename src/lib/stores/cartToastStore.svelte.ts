import { setContext, getContext } from 'svelte';

const CART_TOAST_KEY = Symbol('cart-toast');

class CartToastStore {
  visible = $state(false);
  image = $state('');
  name = $state('');
  timeout: any = null;

  show(image: string, name: string, duration = 2200) {
    this.image = image;
    this.name = name;
    this.visible = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.visible = false;
    }, duration);
  }
}

export function createCartToastStore() {
  const store = new CartToastStore();
  setContext(CART_TOAST_KEY, store);
  return store;
}

export function getCartToastStore() {
  return getContext<CartToastStore>(CART_TOAST_KEY);
}
