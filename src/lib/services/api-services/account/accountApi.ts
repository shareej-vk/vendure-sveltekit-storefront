// Vendure account/address API for SvelteKit Storefront
// Ported from old project, adapted for TypeScript and new conventions

import { vendureApiClient } from '../vendureApiClient';

export interface Address {
  id?: string;
  fullName: string;
  company?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province?: string;
  postalCode: string;
  countryCode: string;
  country?: { code: string; name: string };
  phoneNumber?: string;
  defaultBillingAddress?: boolean;
  defaultShippingAddress?: boolean;
}

export async function getCustomerAddresses(): Promise<Address[]> {
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
  const response = await vendureApiClient({ query });
  console.log(response, "response");
  
  return response?.data?.activeCustomer?.addresses || [];
}

export async function createCustomerAddress(address: Address): Promise<Address> {
  const query = `
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
  const variables = { input: address };
  const data = await vendureApiClient({ query, variables,isMutation:true });
  return data?.createCustomerAddress;
}

export async function updateCustomerAddress(address: Address): Promise<Address> {
  const query = `
    mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
      updateCustomerAddress(input: $input) {
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
  const variables = { input: address };
  const data = await vendureApiClient({ query, variables,isMutation:true });
  return data?.updateCustomerAddress;
}

export async function deleteCustomerAddress(id: string): Promise<boolean> {
  const query = `
    mutation DeleteCustomerAddress($id: ID!) {
      deleteCustomerAddress(id: $id) {
  success
}
    }
  `;
  const variables = { id };
  const data = await vendureApiClient({ query, variables,isMutation:true });
  return !!data?.deleteCustomerAddress;
}

export async function getCustomerProfile(): Promise<any> {
  const query = `
    query GetCustomerProfile {
      activeCustomer {
        id
        firstName
        lastName
        emailAddress
      }
    }
  `;
  const response = await vendureApiClient({ query });
  return response?.data?.activeCustomer;
}

export async function getCategories(): Promise<any[]> {
  const query = `
    query GetCategories {
      categories {
        id
        name
        description
      }
    }
  `;
  const response = await vendureApiClient({ query });
  return response?.data?.categories || [];
}
