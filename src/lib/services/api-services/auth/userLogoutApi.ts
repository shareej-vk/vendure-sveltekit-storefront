// Vendure logout API for SvelteKit
import { PUBLIC_VENDURE_API_URL } from '$env/static/public';

export async function logoutCustomer(): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({}),
      credentials: 'include'
    });
    
    const result = await res.json();
    console.log('Logout result:', result);   
    return { success: true, message: 'Logout successful' };
  } catch (e) {
    return { success: false, message: 'Logout failed' };
  }
}

