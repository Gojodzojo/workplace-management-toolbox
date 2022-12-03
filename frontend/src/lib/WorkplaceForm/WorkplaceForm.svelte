<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiFetch, protectedApiFetch } from '$lib/scripts';
	import { Modal, Select, SelectItem } from 'carbon-components-svelte';
	import { Close } from 'carbon-icons-svelte';

	export let date: string | undefined;

	async function getWorkplaces(date: string | undefined): Promise<{
		workplaces: { workplaceNumber: number; description: string }[];
	}> {
		return await apiFetch('/get-free-workplaces', 'POST', { date });
	}

	async function addReservation() {
		const resp = await protectedApiFetch('/add-reservation', 'PUT', {
			date,
			workplaceNumber: selectedWorkplaceNumber
		});
		date = undefined;
	}

	let selectedWorkplaceNumber = 1;
	// $: selectedWorkplace = workplaces.find((w) => w.number == selectedWorkplaceNumber)!;
	$: freeWorkplacesPromise = getWorkplaces(date);
</script>

<Modal
	size="sm"
	open={date !== undefined}
	modalHeading="Take Workplace"
	primaryButtonText="Make reservation"
	hasForm
	on:open
	on:close={() => (date = undefined)}
	on:submit={addReservation}
>
	{#if date}
		{#await freeWorkplacesPromise}
			loading
		{:then { workplaces }}
			<p>{date}</p>

			<Select
				id="SelectNumber"
				labelText="Select workspace"
				bind:selected={selectedWorkplaceNumber}
			>
				{#each workplaces as { description, workplaceNumber }}
					<SelectItem value={workplaceNumber} />
				{/each}
			</Select>
		{/await}
	{/if}
</Modal>

<style>
	:global(.bx--modal-content) {
		overflow: hidden !important;
	}
</style>
