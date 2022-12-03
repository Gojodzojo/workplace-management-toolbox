import fetch from 'node-fetch';

export async function espFetch(url: string, method: string, body?: any) {
	console.log(url);
	const resp = await fetch(url, {
		method,
		body
	});
	return await resp.text();
}
