<script lang="ts">
	import WorkplaceForm from '$lib/WorkplaceForm/WorkplaceForm.svelte';
	import { Button, Tile } from 'carbon-components-svelte';
	import { formatDate } from '$lib/scripts';

	let days: string[] = [];

	for (let index = 0; index < 30; index++) {
		const date = new Date();
		date.setDate(date.getDate() + index);
		days.push(formatDate(date));
	}

	let clickedDate: string | undefined = undefined;
</script>

<Tile>
	<h1>Reservate your workplace</h1>
	<br /> 
	{#each days as day}
		<Button class="dayBtn" on:click={() => (clickedDate = day)}>{day}</Button>
	{/each}
</Tile>

<WorkplaceForm date={clickedDate} />

<style>
	:global(.dayBtn) {
		margin: 5px;
	}
</style>
