<script lang="ts">
import { getUserStore } from '$lib/stores/user.store.svelte';
const userStore = getUserStore();
let isDropdownOpen = $state(false);
let dropdownRef = $state<HTMLElement | null>(null);

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
    isDropdownOpen = false;
  }
}

function toggleDropdown() {
  isDropdownOpen = !isDropdownOpen;
}

import { logoutCustomer } from '$lib/services/api-services/auth/userLogoutApi';

async function handleLogout() {
  isDropdownOpen = false;
  try {
    const vendureLogout = await logoutCustomer();
    if (vendureLogout.success) {
      window.location.href = '/';
    }
    else{
      alert('Logout failed. Please try again.');
    }
     
  } catch (e) {
   // window.location.href = '/';
  }
}

function getUserInitials() {
  if (!userStore.user) return '';
  const name = userStore.user.firstName || userStore.user.identifier || '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

import { onMount } from 'svelte';
onMount(() => {
  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
});
</script>

<div class="flex items-center space-x-4">
  {#if userStore.user}
    <div class="relative" bind:this={dropdownRef}>
      <button class="flex items-center space-x-2 focus:outline-none" onclick={toggleDropdown} aria-expanded={isDropdownOpen} aria-haspopup="true">
          <span class="text-sm font-medium text-black"> Welcome {getUserInitials()}</span>
     
        <span class="text-sm font-medium text-gray-700">
          {userStore.user.firstName || userStore.user.identifier?.split('@')[0]}
        </span>
        <svg class="h-4 w-4 text-gray-400 transition-transform duration-200" class:rotate-180={isDropdownOpen} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {#if isDropdownOpen}
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical">
          <a href="/account" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onclick={() => isDropdownOpen = false}>My Account</a>
          <a href="/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onclick={() => isDropdownOpen = false}>My Orders</a>
          <div class="border-t border-gray-100 my-1"></div>
          <button onclick={handleLogout} class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</button>
        </div>
      {/if}
    </div>
  {:else}
    <div class="flex items-center space-x-4">
      <a href="/login" class="text-sm font-medium text-gray-700 hover:text-gray-900">Sign in</a>
      <a href="/register" class="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors duration-200">Create account</a>
    </div>
  {/if}
</div>

<style>
  .rotate-180 {
    transform: rotate(180deg);
  }
</style>
