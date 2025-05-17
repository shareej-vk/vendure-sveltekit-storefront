<script lang="ts">
  import AuthNav from "./AuthNav.svelte";
  import WishlistIcon from "./WishlistIcon.svelte";
  import Search from "./search/Search.svelte";
  let { collections = [] } = $props();
  import { getCartStore } from "$lib/stores/cartStore.svelte";
  let cart = $state(getCartStore());
  import { getAppUiStore } from "$lib/stores/appUiStore.svelte";
  const appUiStore = getAppUiStore();
</script>

<header
  class="w-full bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm sticky top-0 z-30"
>
<div class="w-full bg-gray-100 mx-auto flex items-center justify-end px-4 py-3"><AuthNav /></div>
  <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2">
  <a href="/"><img src="/images/cube-logo-small.webp" alt="Logo" class="h-10" /></a>
  <a href="/"><span class="text-xl font-bold">Vendure</span></a>
</div>
    </div>
    <!-- Menu -->
    <nav class="hidden md:flex gap-6 text-base font-medium text-gray-700">
      <a href="/" class="hover:text-primary-600 transition">Home</a>
      <a href="/categories/electronics" class="hover:text-primary-600 transition">Electronics</a>
      <a href="/categories/home-garden" class="hover:text-primary-600 transition"
        >Home & Garden</a
      >
      <a href="/categories/sports-outdoor" class="hover:text-primary-600 transition">Sports & Outdoor</a>
    </nav>
    <div class="lex items-center gap-4">
    <Search class="w-full max-w-xl" />
    </div>
    <!-- Actions -->
    <div class="flex items-center gap-4">
      
      <span class="cursor-pointer"><WishlistIcon /></span>      

      <button
        class="p-3 rounded-full hover:bg-gray-100 text-gray-600 relative cursor-pointer"
        title="Cart"
        onclick={() => appUiStore.openCartSidebar()}
        aria-label="View Cart"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          ><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path
            d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"
          /></svg
        >
        {#if cart.items.length > 0}
          <span
            class="cart-length absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg border border-white"
            >{cart.items.reduce((sum, i) => sum + i.qty, 0)}</span
          >
        {/if}
      </button>
    </div>
  </div>

</header>
