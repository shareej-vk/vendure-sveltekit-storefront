<script lang="ts">
// TODO: Fetch order details by ID using page params
import { page } from '$app/stores';
import { onMount } from 'svelte';
import { getOrderById } from '$lib/services/api-services/orders/ordersApi';
import type { Order } from '$lib/types/order';

let order: Order | null = null;
let loading = $state(true);
let error = $state('');

onMount(async () => {
  loading = true;
  error = '';
  try {
    const id = $page.params.id;
    order = await getOrderById(id);
  } catch (e) {
    error = 'Failed to load order details.';
  } finally {
    loading = false;
  }
});
</script>

<div class="max-w-2xl mx-auto py-8 px-4">
  <h1 class="text-2xl font-bold mb-6 text-gray-900">Order Details</h1>
  {#if loading}
    <div class="text-gray-500">Loading order...</div>
  {:else if error}
    <div class="text-red-500">{error}</div>
  {:else if order}
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <div class="text-lg font-semibold text-gray-800">Order <span class="text-blue-600">#{order.code}</span></div>
          <div class="text-gray-500 text-sm">Placed: {order.orderPlacedAt ? new Date(order.orderPlacedAt).toLocaleString() : '-'}</div>
        </div>
        <div class="flex flex-col sm:items-end">
          <span class="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium mb-1">{order.state}</span>
          <span class="text-xl font-bold text-gray-900">{order.totalWithTax} {order.currencyCode}</span>
        </div>
      </div>
      <div class="border-t border-gray-200 my-4"></div>
      <div>
        <h2 class="text-base font-semibold mb-2 text-gray-700">Items</h2>
        <div class="space-y-4">
          {#each order.lines as line (line.id)}
            <div class="flex items-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm">
              <img
                src={line.productVariant.featuredAsset?.preview || line.productVariant.product?.featuredAsset?.preview || '/placeholder.svg'}
                alt={line.productVariant.name}
                class="w-16 h-16 object-cover rounded border border-gray-200 bg-white"
                loading="lazy"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium text-gray-900 truncate">{line.productVariant.name}</div>
                <div class="text-xs text-gray-500 truncate">SKU: {line.productVariant.sku}</div>
                <div class="text-xs text-gray-500">Quantity: <span class="font-semibold text-gray-700">{line.quantity}</span></div>
                <div class="text-xs text-gray-500">Unit price: <span class="font-semibold text-gray-700">{line.unitPriceWithTax ? (line.unitPriceWithTax / 100).toFixed(2) : '-'} {order.currencyCode}</span></div>
                <div class="text-xs text-gray-500">Line total: <span class="font-semibold text-gray-700">{line.linePriceWithTax ? (line.linePriceWithTax / 100).toFixed(2) : '-'} {order.currencyCode}</span></div>
              </div>
            </div>
          {/each}

        <!-- Order summary -->
        <div class="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-700 font-medium">Subtotal</span>
            <span class="font-semibold text-gray-900">{order.lines && order.lines.length > 0 ? (order.lines.reduce((sum, l) => sum + (l.linePriceWithTax ?? 0), 0) / 100).toFixed(2) : '-'} {order.currencyCode}</span>
          </div>
          <div class="flex justify-between text-base mt-2 pt-2 border-t border-gray-200">
            <span class="text-gray-800 font-semibold">Total</span>
            <span class="font-bold text-blue-700 text-lg">{order.totalWithTax ? (order.totalWithTax / 100).toFixed(2) : '-'} {order.currencyCode}</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  {/if}
</div>
