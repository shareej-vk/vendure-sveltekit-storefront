// Vendure logout API for SvelteKit
import { PUBLIC_VENDURE_API_URL } from '$env/static/public';

export async function logoutCustomer(): Promise<{ success: boolean; message?: string }> {
  const mutation = `mutation { logout { success } }`;
  try {
    const res = await fetch(PUBLIC_VENDURE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query: mutation }),
      credentials: 'include'
    });
    
    const result = await res.json();
    
    if (result?.data?.logout?.success === true) {
      return { success: true, message: 'Logout successful' };
    }
    return { success: false, message: 'Logout failed' };
  } catch (e) {
    return { success: false, message: 'Logout failed' };
  }
}

