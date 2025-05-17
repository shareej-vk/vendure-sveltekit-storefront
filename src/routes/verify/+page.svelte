<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { verifyEmail, requestVerificationEmail } from '$lib/services/api-services/auth/userVerificationApi';

let status: 'verifying' | 'success' | 'error' | 'resending' | 'resent' = 'verifying';
let message = 'Verifying your email...';
let errorCode: string | null = null;
let email = '';
let emailFromUrl = '';

onMount(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    emailFromUrl = urlParams.get('email') || '';
    if (emailFromUrl) {
      email = emailFromUrl;
      localStorage.setItem('verify_email', emailFromUrl);
    } else {
      email = localStorage.getItem('verify_email') || '';
    }
    if (!token) throw new Error('No verification token provided');
    const result = await verifyEmail(token);
    if (result.success) {
      status = 'success';
      message = 'Email verified successfully! You can now log in.';
      setTimeout(() => goto('/login?verified=true'), 3000);
      localStorage.removeItem('verify_email');
    } else {
      errorCode = result.errorCode || null;
      throw new Error(result.error || 'Verification failed');
    }
  } catch (error: any) {
    status = 'error';
    message = error.message || 'An error occurred while verifying your email. Please try again.';
    // Always restore email from localStorage if lost
    if (!email) email = localStorage.getItem('verify_email') || '';
  }
});

async function handleResendVerification() {
  console.log('[Resend] Button clicked');
  console.log('[Resend] Email:', email);
  if (!email) {
    console.error('[Resend] No email provided');
    return;
  }
  try {
    status = 'resending';
    message = 'Sending a new verification email...';
    console.log('[Resend] Status:', status);
    const result = await requestVerificationEmail(email);
    console.log('[Resend] API result:', result);
    if (result.success) {
      status = 'resent';
      message = 'A new verification email has been sent. Please check your inbox.';
      console.log('[Resend] Status:', status);
      localStorage.removeItem('verify_email');
    } else {
      console.error('[Resend] API error:', result.error);
      throw new Error(result.error || 'Failed to send verification email');
    }
  } catch (error: any) {
    status = 'error';
    message = error.message || 'Failed to send a new verification email. Please try again later.';
    console.error('[Resend] Exception:', error);
  }
}
</script>

<section class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {#if status === 'verifying'}Verifying Email...{/if}
        {#if status === 'success'}Verification Successful!{/if}
        {#if status === 'error'}Verification Failed{/if}
        {#if status === 'resending'}Resending Verification...{/if}
        {#if status === 'resent'}Verification Email Sent{/if}
      </h2>
      <p class="text-center text-gray-600 mt-2">{message}</p>
    </div>
    {#if status === 'error'}
      <button type="button" class="w-full py-3 rounded-full bg-amber-700 text-white font-semibold shadow hover:bg-amber-800 transition cursor-pointer mt-4" onclick={handleResendVerification}>
        Resend Verification Email
      </button>
    {/if}
  </div>
</section>
