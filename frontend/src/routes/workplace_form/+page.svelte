<script lang="ts">
	import WorkplaceForm from '$lib/WorkplaceForm/WorkplaceForm.svelte';
	import type { Day } from '$common/types';
	import { Button } from 'carbon-components-svelte';
	import { formatDate } from '$common/scripts';

	let days: Day[] = [
		{ date: new Date('02.12.2022'), isFull: true },
		{ date: new Date('02.12.2022'), isFull: false }
	];

	let clickedDate: Date | undefined = undefined;
</script>

{#each days as { date, isFull }}
	<Button on:click={() => (clickedDate = date)} disabled={isFull}>{formatDate(date)}</Button>
{/each}

<WorkplaceForm date={clickedDate} />
