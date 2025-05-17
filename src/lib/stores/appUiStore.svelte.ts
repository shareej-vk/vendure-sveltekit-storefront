// Common UI store for app-wide UI state (Svelte 5 runes)
// Context-based UI store for app-wide UI state (Svelte 5 runes)
// App UI store using runes-class-context pattern
import { setContext, getContext } from 'svelte';

const APP_UI = Symbol('app-ui');

export class AppUiStore {
  ui = $state({
    cartSidebarOpen: false,
    // Add more UI state here as needed, e.g. mobileMenuOpen, theme, modalOpen, etc.
  });

  toggleCartSidebar() {
    this.ui.cartSidebarOpen = !this.ui.cartSidebarOpen;
  }
  openCartSidebar() {
    this.ui.cartSidebarOpen = true;
  }
  closeCartSidebar() {
    this.ui.cartSidebarOpen = false;
  }
  // Add more UI methods as needed
}

export function createAppUiStore() {
  const store = new AppUiStore();
  setContext(APP_UI, store);
  return store;
}

export function getAppUiStore(): AppUiStore {
  return getContext(APP_UI);
}
