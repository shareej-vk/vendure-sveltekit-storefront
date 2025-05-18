import { json } from '@sveltejs/kit';
import { HOST_URL } from '$env/static/private';

/**
 * Handle user logout
 * @param {Object} params - Request parameters
 * @param {Function} params.cookies - The cookies handler
 * @returns {Promise<Response>} The logout response
 */
export async function POST({ cookies }) {
  try {
    // Create response headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-Origin', HOST_URL);
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    cookies.delete('vendure-auth-token', { path: '/' });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: headers
    });
  } catch (error) {
    console.error('Logout error:', error);
    return json(
      { error: 'Failed to log out' },
      { status: 500 }
    );
  }
}
