<script lang="ts">
import { getCartStore } from '$lib/stores/cartStore.svelte';
import { getCheckoutStore } from '$lib/stores/checkout-store.svelte';
const cart = getCartStore();
const checkout = getCheckoutStore();

function formatCurrency(amount: number) {
  return `₹${(amount / 100).toFixed(2)}`;
}

function getShippingCost() {
  const method = checkout.shippingMethods?.find((m: any) => m.id === checkout.shippingMethod);
  return method ? method.priceWithTax : 0;
}

function getSubtotal() {
  return cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getTotal() {
  return getSubtotal() + getShippingCost();
}
</script>

<div class="bg-white rounded-lg shadow p-6 space-y-4 border border-gray-200">
  <h3 class="text-lg font-semibold text-gray-900 mb-2">Order Summary</h3>
  <div class="divide-y divide-gray-200">
    {#each cart.items as line}
      <div class="flex items-center justify-between py-3">
        <div class="flex items-center">
          <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
            {#if line.image}
              <img src={line.image} alt={line.name} class="h-full w-full object-cover object-center" />
            {/if}
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900">{line.name}</p>
            <p class="text-xs text-gray-500">Qty {line.qty}</p>
          </div>
        </div>
        <p class="text-sm font-semibold text-gray-900">{formatCurrency(line.price * line.qty)}</p>
      </div>
    {/each}
  </div>
  <div class="pt-4 space-y-2">
    <div class="flex justify-between text-sm">
      <span>Subtotal</span>
      <span>{formatCurrency(getSubtotal())}</span>
    </div>
    <div class="flex justify-between text-sm">
      <span>Shipping</span>
      <span>{formatCurrency(getShippingCost())}</span>
    </div>
    <div class="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
      <span>Total</span>
      <span>{formatCurrency(getTotal())}</span>
    </div>
  </div>
</div>
