import { json } from '@sveltejs/kit';
import { VENDURE_API_URL } from '$env/static/private';
import fetch from 'cross-fetch';
import apolloCore from '@apollo/client/core';
const { ApolloClient, InMemoryCache, HttpLink, gql } = apolloCore;

// async function vendureGraphQL({ query, variables, cookies, isMutation = false }: { query: string; variables?: any; cookies: any; isMutation?: boolean }) {
//   // Use SvelteKit's cookies API!
//   const session = cookies.get('session');
//   const sessionSig = cookies.get('session.sig');
//   let cookieHeader = [
//     session ? `session=${session}` : '',
//     sessionSig ? `session.sig=${sessionSig}` : ''
//   ].filter(Boolean).join('; ');

//   // Defensive: If no cookies, don't send header at all
//   const headers = cookieHeader ? { Cookie: cookieHeader } : {};

//   const httpLink = new HttpLink({
//     uri: VENDURE_API_URL,
//     fetch,
//     headers,
//   });

//   const client = new ApolloClient({
//     link: httpLink,
//     cache: new InMemoryCache(),
//     ssrMode: true,
//   });

//   let gqlQuery = typeof query === 'string' ? gql`${query}` : query;

//   // Apollo throws on error by default, so wrap in try/catch if you want graceful handling
//   let data;
//   try {
//     if (isMutation) {
//       data = await client.mutate({
//         mutation: gqlQuery,
//         variables
//       });
//     } else {
//       data = await client.query({
//         query: gqlQuery,
//         variables
//       });
//     }
//   } catch (err) {
//     // Return Apollo errors in GraphQL-style for SvelteKit response
//     data = { errors: [err.message] };
//   }

//   return data;
// }


async function vendureGraphQL({ query, variables, cookies : cookiesHeader }: { query: string; variables?: any; cookies: any }) {
  
  const session = cookiesHeader.get('session');
  const sessionSig = cookiesHeader.get('session.sig');
  let cookies = {session, sessionSig};
  
  
  let cookieHeader = '';
  if (cookies.session) cookieHeader += `session=${cookies.session}; `;
  if (cookies.sessionSig) cookieHeader += `session.sig=${cookies.sessionSig};`;
  const vendureHeaders = {
    'Content-Type': 'application/json',
    ...(cookieHeader ? { 'cookie': cookieHeader } : {})
  };
  console.log('Vendure fetch headers:', vendureHeaders);
  const res = await fetch(VENDURE_API_URL, {
    method: 'POST',
    headers: vendureHeaders,
    body: JSON.stringify({ query, variables }),
    credentials: 'include'
  });
  const data = await res.json();
  return data;
}



export async function POST({ request, cookies, locals }) {
  console.log('Received request: INSIDE SHOP REQUEST');
  console.log('Incoming request headers:', Object.fromEntries(request.headers));
  console.log('Incoming cookies:', {
    session: cookies.get('session'),
    sessionSig: cookies.get('session.sig')
  });
  try {
    const { query, variables, isMutation = false } = await request.json();
    if (!query) {
      return json({ error: 'Missing GraphQL query' }, { status: 400 });
    }
    const protectedOps = /activeCustomer|orderHistory|updateCustomer|setCustomer|changePassword|createPaymentMethod|deleteCustomer|deleteAddress|updateAddress/i;
    const isProtected = protectedOps.test(query);
    if (isProtected && (!cookies.get('session') || !cookies.get('session.sig'))) {
      return json({ error: 'Not authenticated' }, { status: 401 });
    }
    const response = await vendureGraphQL({ query, variables, cookies, isMutation });
    //   console.log('Raw Vendure response:', JSON.stringify(response, null, 2));
    if (response.errors) {
      console.error('Vendure API errors:', response.errors);
      console.error('Vendure API full response:', response);
    }
    // console.log('Response:>>>>>', response);
    return json(response);
  } catch (error: any) {
    console.error('Error in /api/shop:', error);
    return json({ error: error.message }, { status: 500 });
  }
}
