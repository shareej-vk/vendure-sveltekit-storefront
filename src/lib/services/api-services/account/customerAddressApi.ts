import { vendureApiClient } from '../vendureApiClient';

// Get all addresses for the current customer
export async function getCustomerAddresses() {
  const query = `
    query GetCustomerAddresses {
      activeCustomer {
        id
        addresses {
          id
          fullName
          company
          streetLine1
          streetLine2
          city
          province
          postalCode
          country {
            code
            name
          }
          phoneNumber
          defaultBillingAddress
          defaultShippingAddress
        }
      }
    }
  `;
  const result = await vendureApiClient({ query });
  return result?.data?.activeCustomer?.addresses || [];
}

// Create a new address for the current customer
export async function createCustomerAddress(address: any) {
  const mutation = `
    mutation CreateCustomerAddress($input: CreateAddressInput!) {
      createCustomerAddress(input: $input) {
        id
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country {
          code
          name
        }
        phoneNumber
        defaultBillingAddress
        defaultShippingAddress
      }
    }
  `;
  const result = await vendureApiClient({ query: mutation, variables: { input: address },isMutation:true });
  return result?.data?.createCustomerAddress;
}
