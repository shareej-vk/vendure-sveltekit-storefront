<script lang="ts">
  import { onMount } from 'svelte';
  import { getCheckoutStore } from '$lib/stores/checkout-store.svelte';
  import OrderSummary from './OrderSummary.svelte';
  import CheckoutStepAddress from './CheckoutStepAddress.svelte';
  import CheckoutStepShipping from './CheckoutStepShipping.svelte';
  import CheckoutStepPayment from './CheckoutStepPayment.svelte';
  import CheckoutStepReview from './CheckoutStepReview.svelte';
  import CheckoutStepper from './CheckoutStepper.svelte';
  const checkout = getCheckoutStore();

  function handleAddressComplete(address: any) {
    console.log('[Checkout] handleAddressComplete called', address);
    checkout.address = address;
    checkout.step = 2;
  }

  function handleShippingComplete(methodId: string) {
    checkout.shippingMethod = methodId;
    checkout.step = 3;
  }

  function handlePaymentComplete(payment: any) {
    checkout.payment = payment;
    // TODO: Submit order
  }
</script>

<CheckoutStepper steps={["Address", "Shipping", "Payment", "Review"]} currentStep={checkout.step - 1} />
<div class="flex flex-col md:flex-row md:items-start gap-8">
  <div class="flex-1 min-w-0">
    {#if checkout.step === 1}
      <CheckoutStepAddress onAddressComplete={handleAddressComplete} />
    {:else if checkout.step === 2}
      <CheckoutStepShipping onShippingComplete={handleShippingComplete} />
    {:else if checkout.step === 3}
      <CheckoutStepPayment onPaymentComplete={handlePaymentComplete} />
    {:else if checkout.step === 4}
      <CheckoutStepReview />
    {/if}
  </div>
  <aside class="w-full md:w-96 shrink-0">
    <OrderSummary />
  </aside>
</div>
