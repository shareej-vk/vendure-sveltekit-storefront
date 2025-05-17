// Vendure login API for SvelteKit
export interface LoginInput {
  emailAddress: string;
  password: string;
}

import { PUBLIC_VENDURE_API_URL } from '$env/static/public';

export async function loginCustomer(input: LoginInput): Promise<{ success: boolean; message?: string; errors?: any }> {
  const query = `mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on InvalidCredentialsError {
        errorCode
        message
      }
      ... on NativeAuthStrategyError {
        errorCode
        message
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }`;

  try {
    const response = await fetch(PUBLIC_VENDURE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query: query, variables: { username: input.emailAddress, password: input.password } }),
      credentials: 'include'
    });
    
    const result = await response.json();

    
    if (result?.data?.login?.identifier) {
      return { success: true, message: 'Login successful' };
    }
    else{
      return { success: false, message: 'Login failed' };
    }
    
  } catch (e) {
    return { success: false, message: 'Login failed' };
  }
}
