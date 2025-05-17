// Search products using the Vendure GraphQL API
export async function searchProducts({ query, skip = 0, take = 12, collectionSlug = '', categoryIds = [], minPrice = '', maxPrice = '' }: {
  query: string;
  skip?: number;
  take?: number;
  collectionSlug?: string;
  categoryIds?: string[];
  minPrice?: string;
  maxPrice?: string;
}) {
  const input: Record<string, any> = {
    term: query,
    skip,
    take,
    facetValueIds: categoryIds,
    collectionSlug: collectionSlug || undefined,
    priceRange: (minPrice || maxPrice) ? { min: Number(minPrice) || 0, max: Number(maxPrice) || undefined } : undefined
  };

  
  const gqlQuery = `
    query SearchProducts($input: SearchInput!) {
      search(input: $input) {
        items {
          productId
          productName
          slug
          description
          productAsset {
            preview
          }
          priceWithTax {
            ... on PriceRange { min max }
            ... on SinglePrice { value }
          }
          currencyCode
          facetValueIds
          collectionIds
          productVariantId
          price {
            ... on PriceRange { min max }
            ... on SinglePrice { value }
          }
          priceWithTax {
            ... on PriceRange { min max }
            ... on SinglePrice { value }
          }
        }
        totalItems
        facetValues {
          count
          facetValue { id name }
        }
      }
    }
  `;
  console.log("SUCCCESSSSS")
  const res = await fetch('/api/shop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: gqlQuery, variables: { input } })
  });

  if (!res.ok){ 
        
    throw new Error('Failed to fetch search results');}
   
  const data = await res.json();
  return data.data.search;
}
