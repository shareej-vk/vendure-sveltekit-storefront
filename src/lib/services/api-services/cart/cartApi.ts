import { vendureApiClient } from '../vendureApiClient';

// Fetch the active order
export async function getActiveOrderApi() {
  const query = `query GetActiveOrder {
    activeOrder {
      id
      lines {
        id
        quantity
        unitPrice
        unitPriceWithTax
        linePriceWithTax
        productVariant { id name sku }
        featuredAsset { preview }
      }
    }
  }`;
  const result = await vendureApiClient({ query, debugLabel: 'getActiveOrderApi' });
  return result?.data?.activeOrder;
}


export async function addToCartApi({ productId, quantity = 1 }: { productId: string; quantity?: number }) {
  const mutation = `mutation AddItemToOrder($productId: ID!, $quantity: Int!) {
    addItemToOrder(productVariantId: $productId, quantity: $quantity) {
      ... on Order {
        id
        totalQuantity
        lines {
          id
          quantity
          unitPrice
          unitPriceWithTax
          linePriceWithTax
          productVariant {
            id
            name
            sku
          }
          featuredAsset {
            preview
          }
          customFields # Remove or adjust if not used in your schema
        }
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }`;

  const result = await vendureApiClient({
    query: mutation,
    variables: { productId, quantity },
    debugLabel: 'addToCartApi',
    isMutation: true
  });

  return result?.data?.addItemToOrder;
}

// Adjust order line quantity
export async function adjustOrderLineApi({ lineId, quantity }: { lineId: string; quantity: number }) {
  const mutation = `mutation AdjustOrderLine($lineId: ID!, $quantity: Int!) {
    adjustOrderLine(orderLineId: $lineId, quantity: $quantity) {
      ... on Order {
        lines {
          id
          quantity
          unitPrice
          unitPriceWithTax
          linePriceWithTax
          productVariant { id name sku }
          featuredAsset { preview }
        }
      }
      ... on ErrorResult { errorCode message }
    }
  }`;
  const result = await vendureApiClient({
    query: mutation,
    variables: { lineId, quantity },
    debugLabel: 'adjustOrderLineApi',
    isMutation: true
  });
  return result?.data?.adjustOrderLine;
}

// Remove order line
export async function removeOrderLineApi({ lineId }: { lineId: string }) {
  const mutation = `mutation RemoveOrderLine($lineId: ID!) {
    removeOrderLine(orderLineId: $lineId) {
      ... on Order {
        lines {
          id
          quantity
          unitPrice
          unitPriceWithTax
          linePriceWithTax
          productVariant { id name sku }
          featuredAsset { preview }
        }
      }
      ... on ErrorResult { errorCode message }
    }
  }`;
  const result = await vendureApiClient({
    query: mutation,
    variables: { lineId },
    debugLabel: 'removeOrderLineApi',
    isMutation: true
  });
  return result?.data?.removeOrderLine;
}

