<script lang="ts">
import { placeOrder as placeOrderOrchestrator } from '$lib/services/api-services/checkout/checkoutApi';
import { getCheckoutStore } from '$lib/stores/checkout-store.svelte';
import { getCartStore } from '$lib/stores/cartStore.svelte';
let loading = $state(false);
let error = $state('');
const checkout = getCheckoutStore();
const cart = getCartStore();
let termsAccepted = $state(false);

function formatCurrency(amount: number) {
  return `₹${(amount / 100).toFixed(2)}`;
}

function getShippingLabel() {
  const method = checkout.shippingMethods?.find((m: any) => m.id === checkout.shippingMethod);
  return method ? `${method.description || method.name} - ${formatCurrency(method.priceWithTax)}` : checkout.shippingMethod;
}

function getShippingCost() {
  const method = checkout.shippingMethods?.find((m: any) => m.id === checkout.shippingMethod);
  return method ? method.priceWithTax : 0;
}

function getSubtotal() {
  return cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getTotal() {
  return getSubtotal() + getShippingCost();
}

async function placeOrder() {
  if (!termsAccepted) {
    error = 'You must accept the terms and conditions.';
    return;
  }
  loading = true;
  error = '';
  try {
    const result = await placeOrderOrchestrator({
      shippingAddress: checkout.address,
      shippingMethodId: checkout.shippingMethod,
      paymentMethodCode: checkout.paymentMethodCode,
      paymentMetadata: {
        cardName: checkout.cardName,
        cardNumber: checkout.cardNumber,
        cardExpiry: checkout.cardExpiry,
        cardCvc: checkout.cardCvc,
        saveInfo: checkout.saveInfo
      }
    });
    if (result.success) {
      cart.clear();
      // Redirect to confirmation page with order code
      const { goto } = await import('$app/navigation');
      goto(`/checkout/confirmation/${result.orderCode}`);
      return;
    } else {
      error = result.error || 'Order placement failed.';
    }
  } catch (e) {
    error = 'Order placement failed.';
  } finally {
    loading = false;
  }
}
</script>

<div class="space-y-6">
  <h2 class="text-lg font-medium text-gray-900">Review your order</h2>
  {#if error}
    <div class="text-red-600 mb-2">{error}</div>
  {/if}

  <!-- Shipping Information Review -->
  <div class="bg-gray-50 p-4 rounded-lg">
    <h3 class="text-sm font-medium text-gray-900">Contact Information</h3>
    <p class="mt-1 text-sm text-gray-700">{checkout.address?.email}</p>
    <p class="mt-1 text-sm text-gray-700">{checkout.address?.phoneNumber}</p>

    <h3 class="mt-4 text-sm font-medium text-gray-900">Shipping Address</h3>
    <p class="mt-1 text-sm text-gray-700">
      {checkout.address?.fullName}<br>
      {checkout.address?.streetLine1}<br>
      {#if checkout.address?.streetLine2}
        {checkout.address.streetLine2}<br>
      {/if}
      {checkout.address?.city}, {checkout.address?.province} {checkout.address?.postalCode}<br>
      {checkout.address?.countryCode}
    </p>

    <h3 class="mt-4 text-sm font-medium text-gray-900">Shipping Method</h3>
    <p class="mt-1 text-sm text-gray-700">{getShippingLabel()}</p>
  </div>

  <!-- Payment Information Review -->
  <div class="bg-gray-50 p-4 rounded-lg">
    <h3 class="text-sm font-medium text-gray-900">Payment Method</h3>
    <p class="mt-1 text-sm text-gray-700">Credit Card ending in {checkout.cardNumber?.slice(-4)}</p>
  </div>

  <!-- Order Summary -->
  <div class="border-t border-gray-200 pt-6">
    <h3 class="text-lg font-medium text-gray-900">Order Summary</h3>
    <div class="mt-4 space-y-4">
      {#each cart.items as line}
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              {#if line.image}
                <img
                  src={line.image}
                  alt={line.name}
                  class="h-full w-full object-cover object-center"
                />
              {/if}
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-900">{line.name}</p>
              <p class="text-sm text-gray-500">Qty {line.qty}</p>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-900">
            {formatCurrency(line.price * line.qty)}
          </p>
        </div>
      {/each}
    </div>

    <div class="mt-6 border-t border-gray-200 pt-6">
      <div class="flex justify-between text-base font-medium text-gray-900">
        <p>Subtotal</p>
        <p>{formatCurrency(getSubtotal())}</p>
      </div>
      <div class="flex justify-between text-base font-medium text-gray-900">
        <p>Shipping</p>
        <p>{formatCurrency(getShippingCost())}</p>
      </div>
      <div class="mt-2 flex justify-between text-base font-medium text-gray-900">
        <p>Total</p>
        <p>{formatCurrency(getTotal())}</p>
      </div>
    </div>
  </div>

  <div class="flex items-center">
    <input
      type="checkbox"
      id="termsAccepted"
      bind:checked={termsAccepted}
      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      required
    />
    <label for="termsAccepted" class="ml-2 block text-sm text-gray-700">
      I agree to the <a href="/terms" class="text-blue-600 hover:text-blue-500">Terms and Conditions</a> and <a href="/privacy" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
    </label>
  </div>

  <div class="button-container flex gap-2">
    <button
      type="button"
      on:click={() => checkout.step = 3}
      class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
      disabled={loading}
    >
      Back
    </button>
    <button
      type="button"
      on:click={placeOrder}
      disabled={loading || !termsAccepted}
      class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white cursor-pointer"
      style="background-color: #2563eb;"
    >
      {loading ? 'Placing Order...' : 'Place Order'}
    </button>
  </div>
</div>
