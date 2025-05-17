<script lang="ts">
import { goto } from '$app/navigation';
import { createUserStore } from '$lib/stores/user.store.svelte';
import { registerCustomer } from '$lib/services/api-services/auth/userRegistrationApi';

const userStore = createUserStore();
let { user, loading, error } = userStore;

let name = $state('Rahul');
let email = $state('rahul@yopmail.com');
let password = $state('adminaadi');
let confirmPassword = $state('adminaadi');

async function register(event: Event) {
  event.preventDefault();
  userStore.setLoading(true);
  userStore.setError(null);
  if (!name || !email || !password || password !== confirmPassword) {
    userStore.setError('Please fill all fields correctly.');
    userStore.setLoading(false);
    return;
  }
  const [firstName, ...lastArr] = name.trim().split(' ');
  const lastName = lastArr.join(' ');
  try {
    const result = await registerCustomer({
      firstName: firstName || name,
      lastName: lastName || '',
      emailAddress: email,
      password
    });
    if (result.success) {
      goto('/login?registered=true');
    } else {
      userStore.setError(result.message || 'Registration failed');
    }
  } catch (e) {
    userStore.setError('Registration failed.');
  } finally {
    userStore.setLoading(false);
  }
}
</script>

<section class="flex justify-center items-center min-h-[calc(100vh-120px)] bg-gray-50">
  <form class="w-full max-w-md bg-white shadow-lg rounded-xl px-8 py-10 space-y-6" onsubmit={register}>
    <h2 class="text-3xl font-bold text-center text-gray-900 mb-2">Create Account</h2>
    <p class="text-center text-gray-500 mb-4">Sign up to start shopping</p>
    {#if error}
      <div class="bg-red-100 text-red-700 px-3 py-2 rounded mb-2 text-sm">{error}</div>
    {/if}
    <div>
      <label class="block text-gray-700 font-medium mb-1" for="name">Name</label>
      <input id="name" type="text" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" bind:value={name} autocomplete="name" required />
    </div>
    <div>
      <label class="block text-gray-700 font-medium mb-1" for="email">Email</label>
      <input id="email" type="email" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" bind:value={email} autocomplete="email" required />
    </div>
    <div>
      <label class="block text-gray-700 font-medium mb-1" for="password">Password</label>
      <input id="password" type="password" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" bind:value={password} autocomplete="new-password" required />
    </div>
    <div>
      <label class="block text-gray-700 font-medium mb-1" for="confirmPassword">Confirm Password</label>
      <input id="confirmPassword" type="password" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" bind:value={confirmPassword} autocomplete="new-password" required />
    </div>
    <button type="submit" class="w-full py-3 rounded-full bg-amber-700 text-white font-semibold shadow hover:bg-amber-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>
      {loading ? 'Registering...' : 'Register'}
    </button>
    <div class="text-center text-gray-500 text-sm mt-2">
      Already have an account? <a href="/login" class="text-primary-600 hover:underline">Sign in</a>
    </div>
  </form>
</section>
