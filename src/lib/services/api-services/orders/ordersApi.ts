import { vendureApiClient } from '../vendureApiClient';
import type { Order } from '$lib/types/order';

/**
 * Fetches all orders for the current customer.
 */
export async function getCustomerOrders(): Promise<Order[]> {
  const query = `
    query GetCustomerOrders {
      activeCustomer {
        orders {
          items {
            id
            code
            state
            totalWithTax
            currencyCode
            orderPlacedAt
            lines {
              id
              quantity
              productVariant {
                id
                name
                sku
                featuredAsset { preview }
                product { featuredAsset { preview } }
              }
            }
          }
        }
      }
    }
  `;
  const json = await vendureApiClient({ query, debugLabel: 'GetCustomerOrders' });

  return json?.data?.activeCustomer?.orders?.items ?? [];
}

/**
 * Fetch a single order by ID for the current customer.
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getCustomerOrders();
  return orders.find(order => order.id === id) ?? null;
}


