<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { formatCurrency } from '$lib/utils/format';
import { getOrderByCode } from '$lib/services/api-services/checkout/checkoutApi';
import { page } from '$app/stores';
let order: any = null;
let loading = $state(true);
let error = $state('');
// Svelte 5: Get order code from page params via $props()
let orderCode = $page.params.id || '';

onMount(async () => {
  if (!orderCode) {
    error = 'No order code provided.';
    loading = false;
    return;
  }
  try {
    loading = true;
    order = await getOrderByCode(orderCode);
    if (!order) {
      error = 'Order not found.';
    }
  } catch (e) {
    error = 'Failed to load order details.';
  } finally {
    loading = false;
  }
});
</script>

<div class="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
    {#if loading}
      <div class="text-center text-gray-500">Loading order details...</div>
    {:else if error}
      <div class="text-center text-red-500">{error}</div>
    {:else if order}
      <div class="text-center mb-8">
        <svg class="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <h1 class="text-2xl font-bold text-gray-900 mt-4">Thank you for your order!</h1>
        <p class="mt-2 text-gray-700">Your order <span class="font-semibold">#{order.code}</span> has been placed successfully.</p>
      </div>
      <div class="border-t border-gray-200 pt-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Order Code:</span>
            <span class="font-medium">{order.code}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Placed At:</span>
            <span>{order.orderPlacedAt ? new Date(order.orderPlacedAt).toLocaleString() : '-'}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Status:</span>
            <span>{order.state}</span>
          </div>
        </div>
        <div class="mt-6">
          <h3 class="text-md font-semibold text-gray-900 mb-2">Items</h3>
          <ul class="divide-y divide-gray-100">
            {#each order.lines as line}
              <li class="py-4 flex items-center gap-4">
                <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center">
                  {#if line.productVariant?.featuredAsset?.preview}
                    <img src={line.productVariant.featuredAsset.preview} alt={line.productVariant.name} class="h-full w-full object-cover object-center" />
                  {:else if line.productVariant?.product?.featuredAsset?.preview}
                    <img src={line.productVariant.product.featuredAsset.preview} alt={line.productVariant.name} class="h-full w-full object-cover object-center" />
                  {:else}
                    <svg class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  {/if}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-900">{line.productVariant?.name || 'Product'}</div>
                  <div class="text-gray-500 text-sm">Qty {line.quantity}</div>
                </div>
                <div class="font-semibold text-gray-900">{formatCurrency(line.linePriceWithTax)}</div>
              </li>
            {/each}
          </ul>
        </div>
        <div class="mt-6 border-t border-gray-100 pt-4">
          <div class="flex justify-between text-base font-medium text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(order.totalWithTax)}</span>
          </div>
        </div>
      </div>
      <div class="mt-8 flex justify-center">
        <button class="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all shadow" on:click={() => goto('/')}>Continue Shopping</button>
      </div>
    {/if}
  </div>
</div>
