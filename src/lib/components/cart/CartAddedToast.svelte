<script lang="ts">
  import { getCartToastStore } from '$lib/stores/cartToastStore.svelte';
  import { getAppUiStore } from '$lib/stores/appUiStore.svelte';
  let toast = $state(getCartToastStore());
  const appUiStore = getAppUiStore();

  function openCart() {
    appUiStore.openCartSidebar();
    toast.visible = false;
  }
</script>

{#if toast.visible}
  <button class="fixed top-6 right-6 z-50 flex items-center gap-4 bg-white/80 backdrop-blur-lg shadow-2xl border border-gray-100 rounded-2xl px-6 py-5 animate-fade-in-out min-w-[260px] max-w-xs cursor-pointer" type="button" onclick={openCart} aria-label="View cart">
    <div class="flex items-center gap-4 w-full">
      <div class="flex items-center justify-center bg-white rounded-xl border shadow w-16 h-16 mr-2">
        <img src={toast.image} alt={toast.name} class="w-14 h-14 object-contain rounded-lg" />
      </div>
      <div class="flex-1 flex flex-col gap-1">
        <div class="flex items-center gap-1">
          <span class="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span class="font-bold text-gray-900 text-base truncate">{toast.name}</span>
        </div>
        <div class="text-xs text-gray-600 font-medium">Added to cart</div>
      </div>
    </div>
  </button>
{/if}

<style>
  @keyframes fade-in-out {
    0% { opacity: 0; transform: translateY(-20px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
  }
  .animate-fade-in-out {
    animation: fade-in-out 2.5s both;
  }
</style>
