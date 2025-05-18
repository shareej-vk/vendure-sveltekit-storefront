import { json } from '@sveltejs/kit';
import { VENDURE_API_URL, HOST_URL } from '$env/static/private';


/**
 * Handle user login
 * @param {Object} params - Request parameters
 * @param {Request} params.request - The incoming request
 * @param {Function} params.fetch - The fetch function

 */
export async function POST({ request, fetch }) {
  console.log('Login request received');
  try {
    // Parse request body
    const { query, variables } = await request.json();

    console.log('Sending login request to Vendure API...');

    // Make the request first
    const response = await fetch(VENDURE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': HOST_URL,
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    });
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    const data = await response.json().catch(() => ({}));
    const authToken = response.headers.get('vendure-auth-token');
    if (authToken) {
      const headers = new Headers();
      headers.append('Set-Cookie', `vendure-auth-token=${authToken}; Path=/; HttpOnly; SameSite=Lax`);
      return new Response(JSON.stringify(data), { headers });
    }

    return json(data);


  }
  catch (error) {
    console.error('Login failed with error:', error);
    return json(
      {
        success: false,
        error: 'Login failed. Please try again.'
      },
      { status: 500 }
    );
  }
}

