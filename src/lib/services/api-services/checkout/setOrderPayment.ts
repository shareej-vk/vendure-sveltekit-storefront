import { vendureApiClient } from '../vendureApiClient';

// Set the payment method for the current order
export async function setOrderPayment(paymentMethodCode: string, metadata: any = {}) {
  const mutation = `
    mutation AddPaymentToOrder($input: PaymentInput!) {
      addPaymentToOrder(input: $input) {
        ... on Order {
          id
          code
          state
          payments { id method state }
        }
        ... on ErrorResult {
          errorCode
          message
        }
      }
    }
  `;
  const variables = { input: { method: paymentMethodCode, metadata } };
  const result = await vendureApiClient({ query: mutation, variables, isMutation: true });
  return result?.data?.addPaymentToOrder;
}
