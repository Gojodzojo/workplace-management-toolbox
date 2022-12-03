<script lang="ts">
	import WorkplaceForm from '$lib/WorkplaceForm/WorkplaceForm.svelte';
	import { Button } from 'carbon-components-svelte';
	import { formatDate } from '$lib/scripts';

	let days: string[] = [];

	for (let index = 0; index < 30; index++) {
		const date = new Date();
		date.setDate(date.getDate() + index);
		days.push(formatDate(date));
	}

	let clickedDate: string | undefined = undefined;
</script>

{#each days as day}
	<Button on:click={() => (clickedDate = day)}>{day}</Button>
{/each}

<WorkplaceForm date={clickedDate} />
