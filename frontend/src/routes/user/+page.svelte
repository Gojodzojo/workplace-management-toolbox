<script lang="ts">
	import { Button, Column, Grid, Row } from 'carbon-components-svelte';
	import { authStore } from '$lib/stores';
	import { goto } from '$app/navigation';
</script>

{#if !$authStore}
	{goto('/')}
{:else}
	<Grid>
		<Row>
			<Column>
				<h1>User page</h1>
				<Button on:click={() => ($authStore = undefined)} kind="danger">Logout</Button>
			</Column>
		</Row>
	</Grid>
{/if}
