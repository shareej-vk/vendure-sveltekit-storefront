import { vendureApiClient } from '../vendureApiClient';

export async function verifyEmail(token: string): Promise<{ success: boolean; error?: string; errorCode?: string }> {
  const query = `mutation VerifyEmail($token: String!) {
    verifyCustomerAccount(token: $token) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on VerificationTokenInvalidError {
        errorCode
        message
      }
      ... on VerificationTokenExpiredError {
        errorCode
        message
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }`;
  const response = await fetch('http://localhost:3000/shop-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { token } })
  });
  const result = await response.json();
  const data = result?.data?.verifyCustomerAccount;
  if (data?.id) {
    return { success: true };
  }
  return { success: false, error: data?.message, errorCode: data?.errorCode };
}

export async function requestVerificationEmail(emailAddress: string): Promise<{ success: boolean; error?: string }> {
  const query = `mutation RequestVerificationEmail($email: String!) {
    requestVerificationEmail(email: $email) {
      ... on Success {
        success
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }`;
  const result = await vendureApiClient({
    query,
    variables: { email: emailAddress }
  });
  const data = result?.data?.requestVerificationEmail;
  if (data?.success) {
    return { success: true };
  }
  return { success: false, error: data?.message };
}
