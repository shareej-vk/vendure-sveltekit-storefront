<script lang="ts">
export let address: any;
export let onEdit: () => void = () => {};
export let onDelete: (id: string) => void = () => {};
export let isDefault: boolean = false;

function handleEdit() {
  onEdit();
}

function handleDelete() {
  onDelete(address.id);
}
</script>

<div class="bg-white overflow-hidden shadow rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
  <div class="p-6">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{address.fullName}</h3>
        {#if address.company}
          <p class="text-sm text-gray-500 mt-0.5">{address.company}</p>
        {/if}
      </div>
      {#if isDefault}
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          Default
        </span>
      {/if}
    </div>
    <div class="mt-4 space-y-1.5 text-sm text-gray-600">
      <p class="flex items-start">
        <svg class="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>{address.streetLine1}{#if address.streetLine2}, {address.streetLine2}{/if}</span>
      </p>
      <p class="flex items-start">
        <svg class="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 opacity-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>{address.city}, {address.province} {address.postalCode}</span>
      </p>
      <p class="flex items-start">
        <svg class="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{address.country?.name}</span>
      </p>
      {#if address.phoneNumber}
        <p class="flex items-start mt-3">
          <svg class="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{address.phoneNumber}</span>
        </p>
      {/if}
    </div>
    <div class="flex justify-end gap-2 mt-6">
      <button class="text-indigo-600 hover:text-indigo-900 font-medium text-sm" onclick={handleEdit}>Edit</button>
      <button class="text-red-600 hover:text-red-800 font-medium text-sm" onclick={handleDelete}>Delete</button>
    </div>
  </div>
</div>
