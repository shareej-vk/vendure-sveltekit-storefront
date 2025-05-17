import { vendureApiClient } from '../vendureApiClient';

// Get eligible payment methods for the active order
export async function getEligiblePaymentMethods() {
  const query = `
    query {
      eligiblePaymentMethods {
        id
        code
        description
        eligibilityMessage
        isEligible
      }
    }
  `;
  const result = await vendureApiClient({ query });
  return result?.data?.eligiblePaymentMethods || [];
}
