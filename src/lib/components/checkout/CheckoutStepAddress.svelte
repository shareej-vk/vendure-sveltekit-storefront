<script lang="ts">
// Country options array for dropdown
const countryOptions = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'ZA', name: 'South Africa' }
  // Add more as needed
];
  import { setShippingAddress, getEligibleShippingMethods } from '$lib/services/api-services/checkout/checkoutApi';
  import SavedAddressList from './SavedAddressList.svelte';
  import { onMount } from 'svelte';
  import { getUserStore } from '$lib/stores/user.store.svelte';
  const userStore = getUserStore();
  let { onAddressComplete } = $props();
import { getCheckoutStore } from '$lib/stores/checkout-store.svelte';
const checkout = getCheckoutStore();
  let loading = $state(false);
let error = $state<string | null>(null);
let showNewAddressForm = $state(false);
let selectedAddressId = $state<string | null>(checkout.selectedAddressId || null);

$effect(() => {
  checkout.selectedAddressId = selectedAddressId;
});

// Example address fields
// Use checkout.address for the form state
if (!checkout.address) {
  checkout.address = {
    email: '',
    fullName: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    province: '',
    postalCode: '',
    countryCode: 'IN',
    phoneNumber: ''
  };
}
let address = $state(checkout.address);
// Keep checkout.address in sync with local address
$effect(() => { checkout.address = address; });

  

function handleSavedSelect(addr: any) {
  selectedAddressId = addr.id;
  checkout.selectedAddressId = addr.id;
  address = { ...addr };
  checkout.address = address;
}

function isAddressValid(addr: any) {
  return !!(addr && addr.email && addr.fullName && addr.streetLine1 && addr.city && addr.postalCode && addr.countryCode);
}


  async function handleSubmit(event: Event) {
  event.preventDefault();
    error = null;
    if (!address.email || !address.fullName || !address.streetLine1 || !address.city || !address.postalCode || !address.countryCode) {
      error = 'Please fill all required fields.';
      return;
    }
    loading = true;
    try {
      // Remove 'email' from address before sending to API
      const { email, ...apiAddress } = address;
      const result = await setShippingAddress(apiAddress);
      // Also add to saved addresses
      let savedId = null;
      try {
        const created = await import('$lib/services/api-services/account/customerAddressApi').then(m => m.createCustomerAddress(apiAddress));
        if (created?.id) savedId = created.id;
      } catch (e) { /* ignore saved address errors */ }
      if (result?.id) {
        // Show saved addresses, select the new one, and trigger reload
        showNewAddressForm = false;
        selectedAddressId = savedId;
        // Reload SavedAddressList by changing a dummy key
        reloadSavedAddresses = Math.random();
      } else {
        error = 'Failed to save address.';
      }
    } catch (e) {
      error = 'Error saving address.';
    } finally {
      loading = false;
    }
  }

</script>

<div class="w-full flex flex-col items-center">
  <div class="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mt-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Shipping Address</h2>
    {#if !showNewAddressForm && userStore.user?.emailAddress}
      <div class="bg-gray-50 rounded-lg p-4 mb-6 flex items-center gap-3 border border-gray-100">
        <span class="text-gray-500 text-sm font-medium">Email:</span>
        <span class="text-gray-900 text-base">{userStore.user.emailAddress}</span>
      </div>
    {/if}
    {#if !showNewAddressForm}
      <SavedAddressList
        {selectedAddressId}
        onSelect={handleSavedSelect}
        onAddNew={() => {
          showNewAddressForm = true;
          selectedAddressId = null;
          address = {
            email: userStore.user?.emailAddress || '',
            fullName: '',
            streetLine1: '',
            streetLine2: '',
            city: '',
            province: '',
            postalCode: '',
            countryCode: 'IN',
            phoneNumber: ''
          };
        }}
      />
    {:else}
      <button
        class="mb-4 text-indigo-600 hover:underline font-medium flex items-center gap-2"
        onclick={() => { showNewAddressForm = false; }}
        type="button"
      >
        ← Back to Saved Addresses
      </button>
    {/if}

    {#if showNewAddressForm}
      <div class="bg-gray-50 rounded-xl shadow p-6 mt-6 border border-gray-100 w-full">
        {#if error}
          <div class="text-red-600 mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</div>
        {/if}
        <form onsubmit={handleSubmit} class="grid grid-cols-1 gap-5">
          <input class="input-modern" type="email" placeholder="Email" bind:value={address.email} required disabled={!!userStore.user?.emailAddress} aria-disabled={!!userStore.user?.emailAddress} />
          <input class="input-modern" type="text" placeholder="Full Name" bind:value={address.fullName} required />
          <input class="input-modern" type="text" placeholder="Street Line 1" bind:value={address.streetLine1} required />
          <input class="input-modern" type="text" placeholder="Street Line 2" bind:value={address.streetLine2} />
          <input class="input-modern" type="text" placeholder="City" bind:value={address.city} required />
          <input class="input-modern" type="text" placeholder="Province" bind:value={address.province} />
          <input class="input-modern" type="text" placeholder="Postal Code" bind:value={address.postalCode} required />
          <select
            class="input-modern"
            bind:value={address.countryCode}
            required
          >
            <option value="">Select Country</option>
            {#each countryOptions as c}
              <option value={c.code}>{c.name}</option>
            {/each}
          </select>
          <input class="input-modern" type="text" placeholder="Phone Number" bind:value={address.phoneNumber} />
          <button class="w-full bg-indigo-600 text-white font-semibold rounded-lg py-3 mt-2 hover:bg-indigo-700 transition-all disabled:opacity-70 shadow-md" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Address'}</button>
        </form>
        <div class="flex justify-between gap-2 mt-8 border-t border-gray-100 pt-6">
          <button
            type="button"
            class="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold shadow"
            onclick={() => { showNewAddressForm = false; }}
          >
            Back
          </button>
          <button
            class="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all shadow"
            onclick={() => { onAddressComplete(address); }}
            disabled={loading || !isAddressValid(address)}
            type="button"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    {/if}

    {#if !showNewAddressForm}
      <div class="flex justify-end mt-8">
        <button
          class="px-8 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all shadow-lg"
          onclick={() => { onAddressComplete(address); }}
          disabled={loading || !(selectedAddressId || isAddressValid(address))}
          type="button"
        >
          Continue to Payment
        </button>
      </div>
    {/if}
  </div>
</div>


