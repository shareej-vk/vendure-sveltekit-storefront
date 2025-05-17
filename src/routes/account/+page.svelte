<script lang="ts">
import { goto } from '$app/navigation';
import { onMount } from 'svelte';
import AddressList from '$lib/components/account/AddressList.svelte';
import type { Customer } from '$lib/types/customer';
import { getCustomerProfile, getCustomerAddresses, getCategories } from '$lib/services/api-services/account/accountApi';

let loading = $state(true); 
let error = $state('');
let customer: Customer | null = $state(null);
let addresses = $state([]);
let categories: { id: string; name: string; description: string; }[] = $state([]);

import { page } from '$app/state';
let activeTab = $derived.by(() =>{ 
  let tab = page.url.searchParams.get('tab')||'profile';
return tab;
});

function setActiveTab(tab: string) {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', tab);
  goto(url, { replaceState: true, keepFocus: true });
}

$effect(async () => {
  loading = true;
  error = '';
  try {
    if (activeTab === 'profile') {
      customer = await getCustomerProfile();
    } else if (activeTab === 'addresses') {
      addresses = await getCustomerAddresses();
      console.log(addresses, "addresses");
      
    } else if (activeTab === 'categories') {
      categories = await getCategories();
    }
  } catch (e) {
    error = 'Failed to load data.';
  } finally {
    loading = false;
  }
});
</script>

<div class="max-w-3xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6 text-gray-900">My Account</h1>
  <div class="border-b border-gray-200 mb-6">
    <nav class="-mb-px flex space-x-8">
      <button
        class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200"
        class:border-b-blue-600={activeTab === 'profile'}
        class:text-blue-600={activeTab === 'profile'}
        class:text-gray-500={activeTab !== 'profile'}
        onclick={() => setActiveTab('profile')}
      >
        Profile
      </button>
      <button
        class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200"
        class:border-b-blue-600={activeTab === 'addresses'}
        class:text-blue-600={activeTab === 'addresses'}
        class:text-gray-500={activeTab !== 'addresses'}
        onclick={() => setActiveTab('addresses')}
      >
        Addresses
      </button>
    </nav>
  </div>

  <div>
    {#if loading}
      <div class="text-gray-500">Loading...</div>
    {:else if error}
      <div class="text-red-500">{error}</div>
    {:else if activeTab === 'profile' && customer}
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Profile Information</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div class="text-xs text-gray-500">Name</div>
            <div class="font-medium text-gray-900">{customer.firstName} {customer.lastName}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500">Email</div>
            <div class="font-medium text-gray-900">{customer.emailAddress}</div>
          </div>
        </div>
      </div>
    {:else if activeTab === 'addresses'}
      <AddressList {addresses} />
    {/if}
  </div>
</div>
