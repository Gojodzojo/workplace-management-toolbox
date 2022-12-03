<script lang="ts">
	import { isAuthModalOpen } from '$lib/stores';
	import { Button, Column, Grid, Row, Tile } from 'carbon-components-svelte';
</script>

<div class="wrapper">
	<p>If you need to manage your workplaces</p>
	<h1>WMT</h1>
	<p>has got your back</p>
	<Button class="auth-button" on:click={() => ($isAuthModalOpen = true)}
		>Login / Register now</Button
	>
</div>

<style>
	.wrapper {
		width: 100%;
		height: calc(100vh - 7rem);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		font-size: 35vmin;
	}

	p {
		font-size: 3vmin;
	}

	.wrapper :global(.auth-button) {
		margin-top: 5vmin;
	}
</style>
