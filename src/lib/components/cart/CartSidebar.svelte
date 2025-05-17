<script lang="ts">
  import { getAppUiStore } from '$lib/stores/appUiStore.svelte';
  import { getCartStore } from '$lib/stores/cartStore.svelte';
  import { decrementItem, incrementItem, removeItem } from '$lib/effects/cartEffects';
  const appUiStore = getAppUiStore();
  const cart = getCartStore();

  function closeCart() {
    appUiStore.closeCartSidebar();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') appUiStore.closeCartSidebar();
  }
</script>
  
{#if appUiStore.ui.cartSidebarOpen}
  <div class="fixed inset-0 z-40">
    <div class="absolute inset-0 bg-black/40" role="presentation" tabindex="-1" onclick={closeCart} onkeydown={handleKeydown}></div>
    <aside class="absolute right-0 top-0 h-full w-full max-w-lg bg-white/90 backdrop-blur-lg shadow-2xl p-8 flex flex-col rounded-l-2xl border-l border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Your Cart</h2>
        <button class="text-gray-400 hover:text-red-500 text-2xl font-bold" onclick={closeCart} aria-label="Close">&times;</button>
      </div>
      {#if cart.items.length === 0}
        <div class="flex-1 flex flex-col items-center justify-center text-gray-400">Your cart is empty.</div>
      {:else}
        <div class="flex-1 overflow-y-auto pr-2">
          {#each cart.items as item}
            <div class="flex items-center gap-4 py-3 border-b last:border-b-0">
              <div class="flex items-center justify-center bg-white rounded-xl border shadow w-20 h-20 mr-2">
  <img src={item.image} alt={item.name} class="w-16 h-16 object-contain rounded-lg" />
</div>
              <div class="flex-1">
                <div class="font-bold text-gray-900 text-base mb-1 truncate">{item.name}</div>
                <div class="flex items-center gap-3 mt-2">
                  <button class="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-lg font-bold shadow-sm transition" onclick={() => decrementItem(item.lineId, cart)} aria-label="Decrease">-</button>
                  <span class="text-base text-gray-800 font-semibold px-2">{item.qty}</span>
                  <button class="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-lg font-bold shadow-sm transition" onclick={() => incrementItem(item.lineId, cart)} aria-label="Increase">+</button>
                </div>
                <div class="text-indigo-700 font-extrabold mt-2 text-lg">₹{(item.price/100).toFixed(2)}</div>
              </div>
              <button class="text-red-500 hover:bg-red-100 rounded-full p-2 ml-2 transition shadow-sm border border-red-100" onclick={() => removeItem(item.lineId, cart)} aria-label="Remove">
  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
</button>
            </div>
          {/each}
        </div>
        <div class="mt-6 border-t pt-4">
          <div class="flex justify-between font-semibold text-lg mb-4">
            <span>Total</span>
            <span>₹{(cart.total/100).toFixed(2)}</span>
          </div>
          <a href="/checkout" class="block w-full">
  <button class="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow transition cursor-pointer" onclick={closeCart}>Checkout</button>
</a>
        </div>
      {/if}
    </aside>
  </div>
{/if}
  
  <style>
  .bg-black\/40 {
    background: rgba(0,0,0,0.4);
  }
  </style>