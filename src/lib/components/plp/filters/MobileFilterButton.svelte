<script lang="ts">
  export let onClick: () => void = () => {};
</script>

<button
  class="mr-2 flex items-center px-4 py-2 rounded-full shadow-lg bg-indigo-600 text-white font-semibold text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 lg:hidden"

  onclick={onClick}
  aria-label="Show filters"
>
  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 017 17v-3.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" />
  </svg>
  Filters
</button>
