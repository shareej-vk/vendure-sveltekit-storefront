import { redirect, type Handle, type HandleServerError, type HandleFetch } from '@sveltejs/kit';
import { VENDURE_API_URL } from '$env/static/private';

declare global {
  namespace App {
    interface Locals {
      user?: {
        id: string;
        title: string;
        firstName: string;
        lastName: string;
        emailAddress: string;
        phoneNumber: string;
        user: {
          id: string;
          identifier: string;
          verified: boolean;
          roles: {
            code: string;
            description: string;
            permissions: string[];
          }[];
        };
      } | null;
    }
  }
}
async function getCurrentUser(token: string) {
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
        'Authorization': `Bearer ${token}`
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
  const token = event.cookies.get('vendure-auth-token');
  if (token) {
    try {
      const user = await getCurrentUser(token);
      if (user) {
        event.locals.user = user;
      }
      else{
        event.locals.user = null;
      }
    } catch (error) {
      console.error('Failed to validate user:', error);
      event.locals.user = null;
    }
  }

  // Redirect to login if user is not authenticated and route is not login or register
  const protectedRoutes = ['/login', '/register'];
  if (!event.locals.user && !protectedRoutes.some(route => event.url.pathname.includes(route))) {
    throw redirect(302, '/login');
  }

  const response = await resolve(event);
  return response;
};

