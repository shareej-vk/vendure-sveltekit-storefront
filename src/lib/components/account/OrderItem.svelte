<script lang="ts">
import type { Order } from '$lib/types/order';
import { formatCurrency } from '$lib/utils/format';
import { goto } from '$app/navigation';

export let order: Order;


</script>

<a href={`/orders/${order.id}`} type="button"
  class="bg-white shadow rounded-lg p-4 flex flex-col gap-2 border border-gray-100 hover:shadow-md transition cursor-pointer text-left w-full"
 
  aria-label={`View order ${order.code}`}
>

  <div class="flex items-center gap-4">
    <div class="flex-1">
      <div class="font-semibold text-gray-900">Order #{order.code}</div>
      <div class="text-xs text-gray-500 mt-1">Placed: {order.orderPlacedAt ? new Date(order.orderPlacedAt).toLocaleString() : '-'}</div>
      <div class="text-xs text-gray-500">Status: {order.state}</div>
      <div class="text-xs text-gray-500">Total: {formatCurrency(order.totalWithTax, order.currencyCode)}</div>
    </div>
    <div class="flex gap-1">
      {#each order.lines.slice(0, 3) as line}
        {#if line.productVariant?.featuredAsset?.preview}
          <img src={line.productVariant.featuredAsset.preview.replace(/\\/g, '/')} alt={line.productVariant.name} class="h-10 w-10 rounded border border-gray-200 object-cover" />
        {:else if line.productVariant?.product?.featuredAsset?.preview}
          <img src={line.productVariant.product.featuredAsset.preview.replace(/\\/g, '/')} alt={line.productVariant.name} class="h-10 w-10 rounded border border-gray-200 object-cover" />
        {:else}
          <div class="h-10 w-10 rounded border border-gray-200 bg-gray-100 flex items-center justify-center">
            <svg class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</a>
