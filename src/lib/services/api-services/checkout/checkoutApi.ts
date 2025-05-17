import { vendureApiClient } from '../vendureApiClient';

// Fetch order details by code (confirmation page)
export async function getOrderByCode(code: string) {
  if (!code) throw new Error('Order code is required');
  const query = `
    query GetOrderByCode($code: String!) {
      orderByCode(code: $code) {
        id
        code
        state
        currencyCode
        totalWithTax
        total
        orderPlacedAt
        updatedAt
        customer {
          id
          emailAddress
          firstName
          lastName
        }
        shippingAddress {
          fullName
          streetLine1
          streetLine2
          city
          province
          postalCode
          country
          phoneNumber
        }
        billingAddress {
          fullName
          streetLine1
          streetLine2
          city
          province
          postalCode
          country
          phoneNumber
        }
        lines {
          id
          quantity
          linePriceWithTax
          productVariant {
            id
            name
            sku
            featuredAsset {
              preview
              source
            }
            product {
              id
              name
              slug
              featuredAsset {
                preview
                source
              }
            }
          }
        }
        payments {
          id
          amount
          state
          method
          transactionId
          errorMessage
        }
        shippingLines {
          shippingMethod {
            id
            name
            description
          }
          priceWithTax
        }
      }
    }
  `;
  const variables = { code };
  const result = await vendureApiClient({ query, variables });
  return result?.data?.orderByCode;
}


// Get the current order state
export async function getOrderState() {
  const query = `
    query {
      activeOrder {
        id
        code
        state
        active
        __typename
      }
    }
  `;
  const result = await vendureApiClient({ query });
  return result?.data?.activeOrder;
}

// Get eligible shipping methods for the active order
export async function getEligibleShippingMethods() {
  const query = `
    query {
      eligibleShippingMethods {
        id
        code
        description
        price
        priceWithTax
        metadata
      }
    }
  `;
  const result = await vendureApiClient({ query });
  return result?.data?.eligibleShippingMethods || [];
}

// Set the shipping address for the current order
export async function setShippingAddress(address: any) {
  const mutation = `
    mutation SetShippingAddress($input: CreateAddressInput!) {
      setOrderShippingAddress(input: $input) {
        ... on Order {
          id
          state
          code
          shippingAddress {
            fullName
            streetLine1
            streetLine2
            city
            province
            postalCode
            countryCode
            phoneNumber
          }
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;
  const variables = { input: address };
  const result = await vendureApiClient({ query: mutation, variables, isMutation: true });
  return result?.data?.setOrderShippingAddress;
}

// Set the shipping method for the current order
export async function setOrderShippingMethod(shippingMethodId: string) {
  const mutation = `
    mutation SetShippingMethod($id: [ID!]!) {
      setOrderShippingMethod(shippingMethodId: $id) {
        ... on Order {
          id
          state
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;
  const variables = { id: [shippingMethodId] };
  const result = await vendureApiClient({ query: mutation, variables, isMutation: true });
  return result?.data?.setOrderShippingMethod;
}

// Transition the order to a new state
export async function transitionOrderToState(state: string) {
  console.log("transitionOrderToState state>>>>", state);
  const mutation = `
    mutation TransitionOrderState($state: String!) {
      transitionOrderToState(state: $state) {
        ... on Order {
          id
          code
          state
          __typename
        }
        ... on OrderStateTransitionError {
          errorCode
          message
          transitionError
          fromState
          toState
          __typename
        }
      }
    }
  `;
  const variables = { state };
  const result = await vendureApiClient({ query: mutation, variables, isMutation: true });
  return result?.data?.transitionOrderToState;
}

// Place order orchestration function (matches Svelte 4 logic)
export interface PlaceOrderArgs {
  shippingAddress: any;
  shippingMethodId: string;
  paymentMethodCode: string;
  paymentMetadata?: any;
}

export interface PlaceOrderResult {
  success: boolean;
  orderCode?: string;
  order?: any;
  error?: string;
}

export async function placeOrder({ shippingAddress, shippingMethodId, paymentMethodCode, paymentMetadata = {} }: PlaceOrderArgs): Promise<PlaceOrderResult> {
  try {
    // 1. Set shipping address
    // Map to Vendure CreateAddressInput
    const addressInput = {
      fullName: shippingAddress.fullName,
      streetLine1: shippingAddress.streetLine1,
      streetLine2: shippingAddress.streetLine2,
      city: shippingAddress.city,
      province: shippingAddress.province,
      postalCode: shippingAddress.postalCode,
      countryCode: shippingAddress.countryCode || shippingAddress.country?.code,
      phoneNumber: shippingAddress.phoneNumber
    };
    await setShippingAddress(addressInput);

    // 2. Get order state and ensure 'AddingItems'
    const orderStateResp = await getOrderState();
    const orderState = orderStateResp?.state;
    if (orderState !== 'AddingItems') {
      throw new Error('Order must be in "AddingItems" state to set shipping method.');
    }

    // 3. Set shipping method
    let shippingMethodResult = await setOrderShippingMethod(shippingMethodId);
    let shippingMethodData = shippingMethodResult;
    if (!shippingMethodData || shippingMethodData.__typename === 'ErrorResult') {
      throw new Error('Provided shipping method is not eligible or was rejected by the server.');
    }
console.log("shippingMethod DONE>>>>", shippingMethodData);
    // 4. Transition to ArrangingPayment
    let transitionResult = await transitionOrderToState('ArrangingPayment');
    let transitionData = transitionResult;
    if (!transitionData || transitionData.__typename === 'OrderStateTransitionError') {
      // Fallback: try eligible shipping methods
      const eligibleMethods = await getEligibleShippingMethods();
      if (!eligibleMethods.length) {
        throw new Error('No eligible shipping methods available');
      }
      const fallbackShippingMethodId = eligibleMethods[0].id;
      shippingMethodResult = await setOrderShippingMethod(fallbackShippingMethodId);
      shippingMethodData = shippingMethodResult;
      if (!shippingMethodData || shippingMethodData.__typename === 'ErrorResult') {
        throw new Error('Failed to set any shipping method (fallback)');
      }
      transitionResult = await transitionOrderToState('ArrangingPayment');
      transitionData = transitionResult;
      if (!transitionData || transitionData.__typename === 'OrderStateTransitionError') {
        throw new Error(transitionData?.message || 'Failed to transition order state after fallback');
      }
    }

    // 5. Add payment
    const paymentResult = await (await import('./setOrderPayment')).setOrderPayment(paymentMethodCode, paymentMetadata);
    if (!paymentResult) {
      throw new Error('No payment result returned');
    }
    if (paymentResult.__typename === 'ErrorResult') {
      throw new Error(paymentResult.message || 'Payment failed');
    }

    // Optionally: transition to Completed (not required by default)
    // await transitionOrderToState('Completed');

    return {
      success: true,
      orderCode: paymentResult.code,
      order: paymentResult
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Checkout failed'
    };
  }
}
