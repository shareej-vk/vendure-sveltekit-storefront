<script lang="ts">
  import CheckoutForm from '$lib/components/checkout/CheckoutForm.svelte';
  import { createCheckoutStore } from '$lib/stores/checkout-store.svelte';
  createCheckoutStore();
  // You can import CheckoutSummary here if you want a summary on the side
</script>

<div class="bg-white py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-3xl font-extrabold tracking-tight text-red-600 sm:text-4xl mb-8">
      Checkout
    </h1>
    <CheckoutForm />
  </div>
</div>
