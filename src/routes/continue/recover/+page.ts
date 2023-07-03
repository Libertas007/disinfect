/** @type {import('./$types').PageLoad} */
export function load({ url }) {
	return {
		params: url.searchParams as URLSearchParams
	};
}
