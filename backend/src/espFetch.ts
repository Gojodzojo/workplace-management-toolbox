import fetch from 'node-fetch';

export async function espFetch(url: string, method: string, body?: any) {
	const resp = await fetch('http://192.168.5.52' + url, {
		method,
		body
	});
	return await resp.text();
}
