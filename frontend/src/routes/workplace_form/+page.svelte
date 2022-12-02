<script lang="ts">
	import WorkplaceForm from '$lib/WorkplaceForm/WorkplaceForm.svelte';
	import type { Day } from '$common/types';
	import { Button } from 'carbon-components-svelte';

	let days: Day[] = [
		{ day: 1, isFull: true },
		{ day: 2, isFull: false }
	];

	let isWorkplcModalOpen = false;
</script>

{#each days as { day, isFull }}
	<Button on:click={() => (isWorkplcModalOpen = true)}>{day}</Button>
{/each}

<WorkplaceForm bind:open={isWorkplcModalOpen} />
