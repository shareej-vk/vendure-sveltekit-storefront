<script lang="ts">
  import { getCustomerAddresses } from '$lib/services/api-services/account/customerAddressApi';
  import { onMount } from 'svelte';
  let { selectedAddressId, onSelect, onAddNew } = $props();
  let savedAddresses = $state<any[]>([]);
  let loading = $state(false);
  let error = $state<string|null>(null);

  onMount(async () => {
    loading = true;
    error = null;
    try {
      savedAddresses = await getCustomerAddresses();
    } catch (e) {
      error = 'Failed to load saved addresses.';
    } finally {
      loading = false;
    }
  });

  function handleSelect(address: any) {
    selectedAddressId = address.id;
    onSelect(address);
  }
</script>

<div>
  <h3 class="font-semibold mb-2">Saved Addresses</h3>
  {#if loading}
    <div>Loading addresses...</div>
  {:else if error}
    <div class="text-red-600">{error}</div>
  {:else if savedAddresses.length === 0}
    <div>No saved addresses found.</div>
  {:else}
    <div class="flex flex-col gap-4">
      {#each savedAddresses as address}
        <div class={`border rounded-lg shadow-sm p-4 flex items-start gap-3 cursor-pointer transition-all ${selectedAddressId === address.id ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:shadow-md bg-white'}`}
             onclick={() => handleSelect(address)}>
          <input type="radio" name="savedAddress" class="mt-1 accent-indigo-600" bind:group={selectedAddressId} value={address.id} onchange={() => handleSelect(address)} />
          <div class="flex-1">
            <div class="font-semibold text-gray-900">{address.fullName}</div>
            <div class="text-sm text-gray-700">{address.streetLine1}{address.streetLine2 ? ', ' + address.streetLine2 : ''}</div>
            <div class="text-sm text-gray-700">{address.city}, {address.country?.name} {address.postalCode}</div>
            <div class="text-xs text-gray-500">{address.phoneNumber}</div>
            {#if address.defaultShippingAddress}
              <span class="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">Default</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
  <button type="button" class="mt-6 w-full border-2 border-dashed border-indigo-400 text-indigo-700 font-semibold rounded-lg py-3 bg-indigo-50 hover:bg-indigo-100 transition-all" onclick={onAddNew}>
    + Add New Address
  </button>
</div>

<style>
ul {
  list-style: none;
  padding: 0;
}
</style>
