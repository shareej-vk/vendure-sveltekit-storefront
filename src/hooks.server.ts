import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { VENDURE_API_URL } from '$env/static/private';

async function getCurrentUser(token: string, signature: string) {
  const query = `
    query {
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
          roles {
            code
            description
            permissions
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(VENDURE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${token}; session.sig=${signature}`
      },
      body: JSON.stringify({ query })
    });
    const { data, errors } = await response.json();
    if (errors || !data?.activeCustomer) {
      console.error('Error fetching current user:', errors);
      return null;
    }
    return data.activeCustomer;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session');
  const signature = event.cookies.get('session.sig');

  // Add user to locals if authenticated
  if (token && signature) {
    try {
      const user = await getCurrentUser(token, signature);
      if (user) {
        event.locals.user = user;
       
      } 
    } catch (error) {
      console.error('Error in auth hook:', error);      
    }
  }

  // Handle protected routes
  const protectedRoutes = ['/account', '/checkout'];
  const isProtectedRoute = protectedRoutes.some(route =>
    event.url.pathname.startsWith(route)
  );
  if (isProtectedRoute && !event.locals.user) {
    throw redirect(303, `/login?redirect=${event.url.pathname}`);
  }

  const response = await resolve(event);
  return response;
};

export const handleError: HandleServerError = ({ error, event }) => {
  console.error('Server error:', error);
  return {
    message: 'An unexpected error occurred',
    code: (error as any)?.code ?? 'UNKNOWN_ERROR'
  };
};
