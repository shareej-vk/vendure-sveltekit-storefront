import { vendureApiClient } from '$lib/services/api-services/vendureApiClient';

// Get the wishlist for the active customer
export async function getActiveCustomerWishlist(fetchFn?: typeof fetch) {
  const query = `
    query GetActiveCustomerWishlist {
      activeCustomer {
        id
        customFields {
          wishlistProductIds
        }
      }
    }
  `;
  const res = await vendureApiClient({ query, fetch: fetchFn });
  return res?.data?.activeCustomer;
}

// Add a product to the wishlist
export async function addProductToWishlist(productId: string, fetchFn?: typeof fetch) {
  const mutation = `mutation AddProductToWishlist($productId: String!) {
    addProductToWishlist(productId: $productId) {
    id
    customFields {
      wishlistProductIds
    }
  }
}`;
  const variables = { productId };
  const res = await vendureApiClient({ query: mutation, variables, fetch: fetchFn, isMutation: true });
  return res?.data?.addProductToWishlist;
}

// Remove a product from the wishlist
export async function removeProductFromWishlist(productId: string, fetchFn?: typeof fetch) {
  const mutation = `mutation RemoveProductFromWishlist($productId: String!) {
  removeProductFromWishlist(productId: $productId) {
    id
    customFields {
      wishlistProductIds
    }
  }
}

  `;
  const variables = { productId };
  const res = await vendureApiClient({ query: mutation, variables, fetch: fetchFn, isMutation: true });
  return res?.data?.removeProductFromWishlist;
}
