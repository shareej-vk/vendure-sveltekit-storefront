<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import CartSidebar from '$lib/components/cart/CartSidebar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { createUserStore } from '$lib/stores/user.store.svelte';
  import { createWishlistStore } from '$lib/stores/wishlistStore.svelte';
  import { createCartStore } from '$lib/stores/cartStore.svelte';
  import { createCartToastStore } from '$lib/stores/cartToastStore.svelte';
  import CartAddedToast from '$lib/components/cart/CartAddedToast.svelte';
  import { getActiveCustomerWishlist } from '$lib/services/api-services/wishlist/wishlistApi';
  import{getActiveOrderApi} from '$lib/services/api-services/cart/cartApi';
  import { onMount } from 'svelte';
  import { createAppUiStore } from '$lib/stores/appUiStore.svelte';
  import { createFacetStore } from '$lib/stores/facetStore.svelte';
  import { page, navigating } from '$app/state';
  import Loader from '$lib/components/Loader.svelte';
  const userStore = createUserStore();
  const appUiStore = createAppUiStore();
  let { data, children } = $props();
  const cartStore = createCartStore();
  createCartToastStore(); 
  createFacetStore();
  
  const wishlistStore = createWishlistStore();
  async function initWishlist() {
    try {
      const wishlist = await getActiveCustomerWishlist();
      if (wishlist) {
        wishlistStore.init(wishlist.customFields?.wishlistProductIds ?? []);
      }
    } catch (e) {
      console.error('Failed to load wishlist', e);
    }
  }


  async function initCart() {
    try {
      const order = await getActiveOrderApi();
      if (order && Array.isArray(order.lines)) {
        cartStore.syncFromBackend(order.lines);
      } else {
        cartStore.syncFromBackend([]);
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  } 

  if (data.user) {
    userStore.setUser(data.user);
  }

  onMount(async () => {
    if (data.user) {
    await initWishlist();
    }
    await initCart();
});
  
</script>

<Header />
<CartAddedToast />

<CartSidebar />
{#if navigating.to}
<Loader/>
{/if}
{@render children()}
<Footer />
