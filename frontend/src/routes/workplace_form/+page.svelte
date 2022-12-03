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
	<h1>Reserve your workplace</h1>
	<br />
	<div class="btns-container">
		{#each days as day}
			<Button class="day-btn" kind="tertiary" on:click={() => (clickedDate = day)}>{day}</Button>
		{/each}
	</div>
</Tile>

<WorkplaceForm date={clickedDate} />

<style>
	.btns-container {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		justify-content: center;
	}

	.btns-container :global(.day-btn) {
		margin: 5px;
	}
</style>
