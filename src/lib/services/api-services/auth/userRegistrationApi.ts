// Vendure registration API for SvelteKit
export interface RegisterInput {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
}

export async function registerCustomer(input: RegisterInput): Promise<{ success: boolean; message?: string; errors?: any }> {
  const query = `mutation RegisterCustomerAccount($input: RegisterCustomerInput!) {
    registerCustomerAccount(input: $input) {
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
      ... on MissingPasswordError {
        errorCode
        message
      }
      ... on NativeAuthStrategyError {
        errorCode
        message
      }
      ... on PasswordValidationError {
        errorCode
        message
      }
    }
  }`;

  const response = await fetch('http://localhost:3000/shop-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { input } })
  });
  const result = await response.json();
  const data = result?.data?.registerCustomerAccount;
  if (data?.success) {
    return { success: true, message: data.message };
  }
  return { success: false, message: data?.message || 'Registration failed', errors: result.errors };

}
