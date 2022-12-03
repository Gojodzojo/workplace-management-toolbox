import { writable } from 'svelte/store';

export interface AuthState {
	accessToken: string;
	refreshToken: string;
}

export const authStore = writable<AuthState | undefined>(undefined);

export const isAuthModalOpen = writable(false);
