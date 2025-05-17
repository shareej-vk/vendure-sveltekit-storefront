// src/lib/stores/checkout-store.svelte.ts
import { setContext, getContext } from 'svelte';
const CHECKOUT_STORE = Symbol('CheckoutStore');

export class CheckoutStore {
  address = $state<any>(null);
  shippingMethod = $state<string>('');
  shippingMethods = $state<any[]>([]);
  shippingLoading = $state<boolean>(false);
  shippingError = $state<string | null>(null);
  payment = $state<any>(null);
  step = $state<number>(1);
  paymentMethodCode = $state<string>('');
  cardName = $state<string>('Jeos Joes');
  cardNumber = $state<string>('1111 1111 1111 1111');
  cardExpiry = $state<string>('12/25');
  cardCvc = $state<string>('123');
  saveInfo = $state<boolean>(false);
  // Add more properties as needed (cart, errors, etc.)
}

export function createCheckoutStore() {
  setContext(CHECKOUT_STORE, new CheckoutStore());
}

export function getCheckoutStore() {
  return getContext<CheckoutStore>(CHECKOUT_STORE);
}
