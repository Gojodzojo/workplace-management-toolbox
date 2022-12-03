import { get } from 'svelte/store';
import { authStore } from './stores';
import type { AccessTokenRequest } from '$common/RequestTypes';
import type { AccessTokenResponse } from '$common/ResponseTypes';

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

export function apiFetch<T extends object>(url: string, method: string, body?: T) {
	const b = body ? JSON.stringify(body) : undefined;
	return fetch(API_BASE + url, {
		method,
		body: b,
		referrerPolicy: 'same-origin',
		mode: 'cors',
		headers: { 'Content-Type': 'application/json' }
	});
}
export async function protectedApiFetch<T extends object>(url: string, method: string, body?: T) {
	const auth = get(authStore);

	if (!auth) return { status: 'Unauthorised user' };
	const { accessToken, refreshToken } = auth;

	const b = body ? body : {};
	const resp = await apiFetch(url, method, { accessToken, ...b });
	const jsonResp = await resp.json();

	if (jsonResp.status !== 'Bad access token') return jsonResp;

	const refResp = await apiFetch<AccessTokenRequest>('/token', 'POST', { refreshToken });
	const jsonRefResp: AccessTokenResponse = await refResp.json();

	if ('status' in jsonRefResp) return jsonRefResp;

	authStore.set({ refreshToken, accessToken: jsonRefResp.accessToken });

	return await apiFetch(url, method, { accessToken, ...b });
}
