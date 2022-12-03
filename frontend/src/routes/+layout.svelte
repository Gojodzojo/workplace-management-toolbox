<script>
	import Header from '$lib/Header/Header.svelte';
	import { Content } from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/g100.css';
</script>

<Header />

<Content>
	<slot />
</Content>

<style>
	:global(.bx--content) {
		box-sizing: border-box;
		min-height: calc(100vh - 3rem);
	}
</style>
