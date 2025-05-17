<script lang="ts">
let { formData, isSubmitting = false, onCancel = () => {}, onSubmit = () => {}, title = 'Add New Address' } = $props();

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' }
];

function handleSubmit(event: Event) {
  event.preventDefault();
  onSubmit({
    ...formData,
    countryCode: formData.countryCode || 'US'
  });
}
</script>

<div class="bg-gray-50 p-6 rounded-lg">
  <h3 class="text-lg font-medium text-gray-900 mb-4">
    {title}
  </h3>
  <form onsubmit={handleSubmit} class="space-y-4">
    <div class="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
      <div class="sm:col-span-6">
        <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          id="fullName"
          bind:value={formData.fullName}
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div class="sm:col-span-6">
        <label for="company" class="block text-sm font-medium text-gray-700">Company (Optional)</label>
        <input
          type="text"
          id="company"
          bind:value={formData.company}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div class="sm:col-span-6">
        <label for="streetLine1" class="block text-sm font-medium text-gray-700">Street Address</label>
        <input
          type="text"
          id="streetLine1"
          bind:value={formData.streetLine1}
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div class="sm:col-span-6">
        <label for="streetLine2" class="block text-sm font-medium text-gray-700">Apt, Suite, etc. (Optional)</label>
        <input
          type="text"
          id="streetLine2"
          bind:value={formData.streetLine2}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div class="sm:col-span-3">
        <label for="city" class="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          id="city"
          bind:value={formData.city}
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div class="sm:col-span-3">
        <label for="province" class="block text-sm font-medium text-gray-700">State/Province</label>
        <input
          type="text"
          id="province"
          bind:value={formData.province}
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div class="sm:col-span-3">
        <label for="postalCode" class="block text-sm font-medium text-gray-700">Postal Code</label>
        <input
          type="text"
          id="postalCode"
          bind:value={formData.postalCode}
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div class="sm:col-span-3">
        <label for="countryCode" class="block text-sm font-medium text-gray-700">Country</label>
        <select
          id="countryCode"
          bind:value={formData.countryCode}
          required
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {#each countries as country}
            <option value={country.code}>{country.name}</option>
          {/each}
        </select>
      </div>
      <div class="sm:col-span-6">
        <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          bind:value={formData.phoneNumber}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div class="sm:col-span-6">
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="defaultShippingAddress"
              type="checkbox"
              bind:checked={formData.defaultShippingAddress}
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="defaultShippingAddress" class="font-medium text-gray-700">Default Shipping Address</label>
          </div>
        </div>
        <div class="flex items-start mt-2">
          <div class="flex items-center h-5">
            <input
              id="defaultBillingAddress"
              type="checkbox"
              bind:checked={formData.defaultBillingAddress}
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="defaultBillingAddress" class="font-medium text-gray-700">Default Billing Address</label>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onclick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </div>
  </form>
</div>
