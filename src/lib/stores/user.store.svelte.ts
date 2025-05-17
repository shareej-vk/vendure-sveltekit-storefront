// Svelte 5 runes-class-context user store
import { setContext, getContext } from 'svelte';

const USER_STORE = Symbol('user-store');

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  verified?: boolean;
}

export class UserStore {
  user = $state<IUser | null>(null);
  loading = $state(false);
  error = $state<string | null>(null);

  setUser(user: IUser | null) {
    this.user = user;
  }
  setLoading(loading: boolean) {
    this.loading = loading;
  }
  setError(error: string | null) {
    this.error = error;
  }
  reset() {
    this.user = null;
    this.loading = false;
    this.error = null;
  }
}

export function createUserStore() {
  const store = new UserStore();
  setContext(USER_STORE, store);
  return store;
}

export function getUserStore(): UserStore {
  return getContext(USER_STORE);
}
