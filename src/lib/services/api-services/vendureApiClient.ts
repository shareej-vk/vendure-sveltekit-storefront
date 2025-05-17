// vendureApiClient: makes client-side calls to /api/shop
export async function vendureApiClient({ 
  query, 
  variables, 
  fetch: customFetch, 
  debugLabel,
  isMutation = false
}: { 
  query: string; 
  variables?: any; 
  fetch?: typeof fetch; 
  debugLabel?: string;
  isMutation?: boolean;
}): Promise<any> {
  const doFetch = customFetch ?? fetch;
  if (debugLabel) {
    console.log(`[VendureApiClient][${debugLabel}]>>>>>`, { query, variables, isMutation });
  }
  const response = await doFetch('/api/shop', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'credentials': 'include'
    },
    credentials: 'include',
    body: JSON.stringify({ query, variables, isMutation })
  });

  if (!response.ok) {
    const text = await response.text();
    if (debugLabel) {
      console.error(`[VendureApiClient][${debugLabel}]>>HTTP ERROR`, response.status, text);
    }
    throw new Error(`Vendure API HTTP error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  if (json.errors) {
    if (debugLabel) {
      console.error(`[VendureApiClient][${debugLabel}]>>GRAPHQL ERROR`, json.errors);
    }
    throw new Error(json.errors[0]?.message || 'Vendure API GraphQL error');
  }
  
  if (debugLabel) {
    console.log(`[VendureApiClient][${debugLabel}]>>FINAL JSON>>>`, JSON.stringify(json));
  }
  return json;
}
