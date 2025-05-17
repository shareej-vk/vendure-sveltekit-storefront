<script lang="ts">
import { onMount } from 'svelte';
import { getCheckoutStore } from '$lib/stores/checkout-store.svelte';
import { setOrderPayment } from '$lib/services/api-services/checkout/setOrderPayment';
import { getEligiblePaymentMethods } from '$lib/services/api-services/checkout/getEligiblePaymentMethods';
const checkout = getCheckoutStore();
let paymentMethodCode = $state('');
let eligiblePaymentMethods = $state<any[]>([]);
let loading = $state(false);
let error = $state('');

let { onPaymentComplete } = $props();

onMount(async () => {
  loading = true;
  try {
    eligiblePaymentMethods = await getEligiblePaymentMethods();
    if (eligiblePaymentMethods.length > 0) {
      paymentMethodCode = eligiblePaymentMethods[0].code;
    }
  } catch (e) {
    error = 'Failed to load payment methods.';
  } finally {
    loading = false;
  }
});

function handlePayment() {
  checkout.paymentMethodCode = paymentMethodCode;
  checkout.step = 4; // Advance to review step
  error = '';
  loading = false;
}

function handleFormSubmit(event: Event) {
  event.preventDefault();
  handlePayment();
}
</script>

<div>
  <h2 class="text-lg font-semibold mb-4 text-red-600">Payment & Review</h2>
  {#if loading}
    <div class="text-gray-500">Loading payment methods...</div>
  {:else}
    {#if error}
      <div class="text-red-600 mb-2">{error}</div>
    {/if}
    <form onsubmit={handleFormSubmit}>
      <div class="mb-4">
        <label class="block font-medium mb-2">Select Payment Method</label>
        {#each eligiblePaymentMethods as method}
          <label class="flex items-center mb-2">
            <input type="radio" class="mr-2" name="paymentMethod" bind:group={paymentMethodCode} value={method.code} />
            <span>{method.description || method.code}</span>
          </label>
        {/each}
      </div>

      <!-- Payment Information -->
      <div class="mb-4">
        <h3 class="text-base font-semibold mb-2">Payment Information</h3>
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">Name on card</label>
          <input type="text" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600" placeholder="John Doe" bind:value={checkout.cardName} />
        </div>
        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">Card number</label>
          <input type="text" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600" placeholder="1111 1111 1111 1111" maxlength="19" bind:value={checkout.cardNumber} />
        </div>
        <div class="flex gap-2 mb-2">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Expiration date</label>
            <input type="text" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600" placeholder="12/25" maxlength="5" bind:value={checkout.cardExpiry} />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">CVC</label>
            <input type="text" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600" placeholder="123" maxlength="4" bind:value={checkout.cardCvc} />
          </div>
        </div>
        <div class="flex items-center mb-2">
          <input type="checkbox" id="save-payment-info" class="mr-2 accent-green-600" bind:checked={checkout.saveInfo} />
          <label for="save-payment-info" class="text-sm">Save payment information for next time</label>
        </div>
      </div>

      <div class="flex justify-between gap-2 mt-4">
        <button type="button" class="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold" onclick={() => checkout.step = 2}>Back</button>
        <button class="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all" type="submit" disabled={loading || !paymentMethodCode}>
          {loading ? 'Processing...' : 'Review Order'}
        </button>
      </div>
    </form>
  {/if}
</div>
