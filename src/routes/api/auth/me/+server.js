import { json } from '@sveltejs/kit';
import { VENDURE_API_URL } from '$env/static/private';

export async function GET({ cookies, fetch, request }) {
  try {
    // Get session cookies
    const accessToken = cookies.get('vendure_access_token');
    const accessTokenSig = cookies.get('vendure_access_token.sig');
    
    console.log('Vendure access token cookies:', { 
      hasAccessToken: !!accessToken,
      hasAccessTokenSig: !!accessTokenSig 
    });
    
    if (!accessToken || !accessTokenSig) {
      console.log('Vendure access token cookies not found');
      return json({ 
        data: { me: null, activeCustomer: null }
      }, { status: 200 });
    }
    
    // Query to get current user and active customer
    const verifyQuery = `
      query GetCurrentUser {
        me {
          id
          identifier
          channels {
            token
            code
            permissions
          }
        }
        activeCustomer {
          id
          title
          firstName
          lastName
          emailAddress
          phoneNumber
          user {
            id
            identifier
            verified
          }
        }
            items {
              id
              code
              state
              total
              totalWithTax
              createdAt
              updatedAt
              lines {
                id
                quantity
                productVariant {
                  id
                  name
                  sku
                  price
                  priceWithTax
                  product {
                    id
                    name
                    slug
                    featuredAsset {
                      preview
                    }
                  }
                }
              }
            }
            totalItems
          }
        }
      }`;
    
    console.log('Sending GraphQL query to Vendure API...');
    const response = await fetch(VENDURE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',      
        'Cookie': `session=${accessToken}; session.sig=${accessTokenSig}`
      },
      body: JSON.stringify({
        query: verifyQuery
      })
    });
    
    console.log('Vendure API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vendure API error:', errorText);
      // If not authenticated, return null user data instead of throwing
      if (response.status === 401 || response.status === 403) {
        return json({ data: { me: null, activeCustomer: null } }, { status: 200 });
      }
      throw new Error('Failed to verify session with Vendure API');
    }
    
    const result = await response.json();
    console.log('Vendure API response data:', JSON.stringify(result, null, 2));
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return json({
        data: { me: null, activeCustomer: null },
        _debug: { errors: result.errors }
      });
    }
    
    // Return the user data (with orders)
    return json({
      data: {
        me: result.data?.me || null,
        activeCustomer: result.data?.activeCustomer || null
      }
    });
    
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    // Always return a 200 with null user data if not authenticated
    return json({
      data: { me: null, activeCustomer: null }
    }, { status: 200 });
  }
}
