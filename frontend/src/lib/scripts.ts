import { get } from 'svelte/store';
import { authStore } from './stores';
import type { AccessTokenRequest } from '$common/RequestTypes';

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

export async function apiFetch<T extends object>(url: string, method: string, body?: T) {
	const b = body ? JSON.stringify(body) : undefined;
	const resp = await fetch(API_BASE + url, {
		method,
		body: b,
		referrerPolicy: 'same-origin',
		mode: 'cors',
		headers: { 'Content-Type': 'application/json' }
	});
	return await resp.json()
}
export async function protectedApiFetch<T extends object>(url: string, method: string, body?: T) {
	const auth = get(authStore);

	if (!auth) return { status: 'Unauthorised user' };
	const { accessToken, refreshToken } = auth;

	const b = body ? body : {};
	const resp = await apiFetch(url, method, { accessToken, ...b });

	if (resp.status !== 'Bad access token') return resp;

	const refResp = await apiFetch<AccessTokenRequest>('/token', 'POST', { refreshToken });

	if ('status' in refResp) return refResp;

	authStore.set({ refreshToken, accessToken: refResp.accessToken });

	return await apiFetch(url, method, { accessToken, ...b })
}

export function formatDate(d: Date) {
  return d.toLocaleDateString("pl", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
