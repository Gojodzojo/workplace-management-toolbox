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

export function formatDate(d: Date) {
	return d.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
}
