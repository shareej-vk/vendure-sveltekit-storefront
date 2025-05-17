import { CartStore } from '$lib/stores/cartStore.svelte';
import { addToCartApi, adjustOrderLineApi, removeOrderLineApi } from '$lib/services/api-services/cart/cartApi';
import type { Product } from '$lib/services/api-services/plp/types';

export async function addToCart(productId: string, cart: CartStore): Promise<void> {
  try {
    const response = await addToCartApi({ productId });
    if (response?.lines) cart.syncFromBackend(response.lines);
  } catch (error) {
    console.error('Failed to add to cart:', error);
    throw error;
  }
}

export async function incrementItem(lineId: string, cart: CartStore): Promise<void> {
  const line = cart.items.find(i => i.lineId === lineId);
  if (!line) return;

  try {
    const response = await adjustOrderLineApi({ lineId, quantity: line.qty + 1 });
    if (response?.lines) cart.syncFromBackend(response.lines);
  } catch (error) {
    console.error('Failed to increment item:', error);
    throw error;
  }
}

export async function decrementItem(lineId: string, cart: CartStore): Promise<void> {
  const line = cart.items.find(i => i.lineId === lineId);
  if (!line || line.qty <= 1) return;

  try {
    const response = await adjustOrderLineApi({ lineId, quantity: line.qty - 1 });
    if (response?.lines) cart.syncFromBackend(response.lines);
  } catch (error) {
    console.error('Failed to decrement item:', error);
    throw error;
  }
}

export async function removeItem(lineId: string, cart: CartStore): Promise<void> {
  try {
    const response = await removeOrderLineApi({ lineId });
    if (response?.lines) cart.syncFromBackend(response.lines);
  } catch (error) {
    console.error('Failed to remove item:', error);
    throw error;
  }
}
