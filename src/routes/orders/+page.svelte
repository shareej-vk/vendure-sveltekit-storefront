<script lang="ts">
import { onMount } from 'svelte';
import { getCustomerOrders } from '$lib/services/api-services/orders/ordersApi';
import OrderItem from '$lib/components/account/OrderItem.svelte';
import type { Order } from '$lib/types/order';

let orders = $state<Order[]>([]);
let loading = $state(true);
let error = $state('');

onMount(async () => {
  loading = true;
  error = '';
  try {
    orders = await getCustomerOrders();
  } catch (e) {
    error = 'Failed to load orders.';
  } finally {
    loading = false;
  }
});
</script>


<div class="max-w-3xl mx-auto py-8 px-4">
  <h1 class="text-2xl font-bold mb-6 text-gray-900">Your Orders</h1>
  {#if loading}
    <div class="text-gray-500">Loading orders...</div>
  {:else if error}
    <div class="text-red-500">{error}</div>
  {:else if orders.length === 0}
    <div class="text-gray-500">You have no orders yet.</div>
  {:else}
    <div class="flex flex-col gap-4">
      {#each orders as order (order.id)}
        <OrderItem {order} />
      {/each}
    </div>
  {/if}
</div>
