<script lang="ts">
import { getCustomerAddresses, createCustomerAddress, updateCustomerAddress, deleteCustomerAddress } from '$lib/services/api-services/account/accountApi';
import AddressCard from '$lib/components/account/AddressCard.svelte';
import AddressForm from '$lib/components/account/AddressForm.svelte';

let { addresses} = $props();

console.log($state.snapshot(addresses));

async function loadAddresses() {
  try {
    addresses = await getCustomerAddresses();
  } catch (e) {
    addresses = [];
  }
}

let isAdding = $state(false);
let isEditing = $state(false);
let currentAddress = $state(null);
let isSubmitting = $state(false);

const emptyAddress = {
  fullName: '',
  company: '',
  streetLine1: '',
  streetLine2: '',
  city: '',
  province: '',
  postalCode: '',
  countryCode: 'US',
  phoneNumber: '',
  defaultShippingAddress: false,
  defaultBillingAddress: false
};

function handleAddNew() {
  currentAddress = { ...emptyAddress };
  isAdding = true;
  isEditing = false;
}

function handleEdit(address: { fullName: string; company: string; streetLine1: string; streetLine2: string; city: string; province: string; postalCode: string; countryCode: string; phoneNumber: string; defaultShippingAddress: boolean; defaultBillingAddress: boolean; }) {
  const { country, ...addressToUpdate } = address;
  currentAddress = { ...addressToUpdate, countryCode: address.country?.code || 'US' };
  isEditing = true;
  isAdding = false;
}

function handleCancel() {
  currentAddress = null;
  isAdding = false;
  isEditing = false;
}

async function handleDelete(id: string) {
  isSubmitting = true;
  try {
    await deleteCustomerAddress(id);
    await loadAddresses();
  } finally {
    isSubmitting = false;
  }
}

async function handleSubmit(address) {
  isSubmitting = true;
  try {
    if (isEditing) {
      await updateCustomerAddress(address);
      await loadAddresses();
    } else {
      await createCustomerAddress(address);
      await loadAddresses();
    }
  } finally {
    isSubmitting = false;
    isAdding = false;
    isEditing = false;
  }
}
</script>

<div class="space-y-6">
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Saved Addresses</h2>
      <p class="mt-1 text-sm text-gray-500">Manage your shipping and billing addresses</p>
    </div>
    <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onclick={handleAddNew}>
      + Add New Address
    </button>
  </div>

  {#if isAdding || isEditing}
    <AddressForm
      formData={currentAddress}
      isSubmitting={isSubmitting}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title={isEditing ? 'Edit Address' : 'Add New Address'}
    />
  {/if}

  {#if !isAdding && !isEditing}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each addresses as address (address.id)}
      <AddressCard
        {address}
        onEdit={() => handleEdit(address)}
        onDelete={handleDelete}
        isDefault={address.defaultShippingAddress || address.defaultBillingAddress}
      />
    {/each}
  </div>
{/if}
</div>
