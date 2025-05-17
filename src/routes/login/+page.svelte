<script lang="ts">
let { } = $props();
let email = $state('vkshey@gmail.com');
let password = $state('adminaadi');
let loading = $state(false);
let error = $state('');
import { loginCustomer } from '$lib/services/api-services/auth/userLoginApi';
async function login(event: Event) {
  event.preventDefault();
  loading = true;
  error = '';
  if (!email || !password) {
    error = 'Please enter both email and password.';
    loading = false;
    return;
  }
  try {
    const res = await loginCustomer({ emailAddress: email, password });
    if (!res.success) {
      error = res.message || 'Login failed.';
      loading = false;
      return;
    }
    // Success: redirect or show success
    loading = false;
    window.location.href = '/';
  } catch (e) {
    error = 'Network error.';
    loading = false;
  }
}
</script>

<section class="flex justify-center items-center min-h-[calc(100vh-120px)] bg-gray-50">
  <form class="w-full max-w-md bg-white shadow-lg rounded-xl px-8 py-10 space-y-6" onsubmit={login}>
    <h2 class="text-3xl font-bold text-center text-gray-900 mb-2">Sign In</h2>
    <p class="text-center text-gray-500 mb-4">Welcome back! Please login to your account.</p>
    {#if error}
      <div class="bg-red-100 text-red-700 px-3 py-2 rounded mb-2 text-sm">{error}</div>
    {/if}
    <div>
      <label class="block text-gray-700 font-medium mb-1" for="email">Email</label>
      <input id="email" type="email" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700" bind:value={email} autocomplete="email" required />
    </div>
    <div>
      <label class="block text-gray-700 font-medium mb-1" for="password">Password</label>
      <input id="password" type="password" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700" bind:value={password} autocomplete="current-password" required />
    </div>
    <button type="submit" class="w-full py-3 rounded-full bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>
      {loading ? 'Signing in...' : 'Login'}
    </button>
    <div class="text-center text-gray-500 text-sm mt-2">
      Don't have an account? <a href="/register" class="text-amber-700 hover:underline">Register</a>
    </div>
  </form>
</section>
