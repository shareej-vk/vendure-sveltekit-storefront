<script lang="ts">
  import { onMount } from 'svelte';
  import { getEligibleShippingMethods } from '$lib/services/api-services/checkout/checkoutApi';
  let { onShippingComplete } = $props();
  import { getCheckoutStore } from '$lib/stores/checkout-store.svelte';
  const checkout = getCheckoutStore();
  if (!checkout.shippingMethod) checkout.shippingMethod = '';
  if (!checkout.shippingMethods) checkout.shippingMethods = [];
  if (!checkout.shippingLoading) checkout.shippingLoading = false;
  if (!checkout.shippingError) checkout.shippingError = null;
  let selectedShippingMethod = $state(checkout.shippingMethod);
  let shippingMethods = $state(checkout.shippingMethods);
  let loading = $state(checkout.shippingLoading);
  let error = $state<string | null>(checkout.shippingError);
  $effect(() => { checkout.shippingMethod = selectedShippingMethod; });
  $effect(() => { checkout.shippingMethods = shippingMethods; });
  $effect(() => { checkout.shippingLoading = loading; });
  $effect(() => { checkout.shippingError = error; });

  onMount(async () => {
    loading = true;
    try {
      shippingMethods = await getEligibleShippingMethods();
      if (shippingMethods.length > 0) selectedShippingMethod = shippingMethods[0].id;
    } catch (e) {
      error = 'Failed to load shipping methods.';
    } finally {
      loading = false;
    }
  });
</script>

<div>
  
  <h2 class="text-lg font-semibold mb-4 text-red-600">Shipping Method</h2>
  {#if loading}
    <div class="text-indigo-600 mb-4">Loading shipping methods...</div>
  {:else if error}
    <div class="text-red-600 mb-4">{error}</div>
  {:else if shippingMethods.length > 0}
    <div class="flex flex-col gap-3 mb-4">
      {#each shippingMethods as method}
        <label class="flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md" class:selected={selectedShippingMethod === method.id}>
          <input type="radio" name="shippingMethod" value={method.id} bind:group={selectedShippingMethod} />
          <div class="flex-1">
            <div class="font-medium">{method.description}</div>
            <div class="text-xs text-gray-500">{method.code}</div>
          </div>
          <div class="font-semibold text-indigo-700">₹{(method.priceWithTax/100).toFixed(2)}</div>
        </label>
      {/each}
    </div>
    <div class="flex justify-between gap-2 mt-6">
      <button
        type="button"
        class="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
        onclick={() => { checkout.step = 1; }}
      >
        Back
      </button>
      <button
        class="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
        onclick={() => { if (selectedShippingMethod) { loading = true; onShippingComplete(selectedShippingMethod); } }}
        disabled={!selectedShippingMethod || loading}
        aria-disabled={!selectedShippingMethod || loading}
        type="button"
      >
        {#if loading}
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
          Processing...
        {:else}
          Continue to Payment
        {/if}
      </button>
    </div>
    {#if !selectedShippingMethod && !loading}
      <div class="text-sm text-red-600 mt-2">Please select a shipping method to continue.</div>
    {/if}
  {:else}
    <div class="text-gray-500">No shipping methods found.</div>
  {/if}
</div>
