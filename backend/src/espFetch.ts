import fetch from 'node-fetch';

export async function espFetch(url: string, method: string, body?: any) {
	const resp = await fetch(url, {
		method,
		body
	});
	return await resp.text();
}
