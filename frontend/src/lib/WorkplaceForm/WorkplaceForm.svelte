<script lang="ts">
	import { apiFetch, protectedApiFetch } from '$lib/scripts';
	import { Modal, Select, SelectItem } from 'carbon-components-svelte';
	import { authStore } from '$lib/stores';
	import { goto } from '$app/navigation';

	export let date: string | undefined;

	async function getWorkplaces(date: string | undefined): Promise<{
		workplaces: { workplaceNumber: number; description: string }[];
	}> {
		return await apiFetch('/get-free-workplaces', 'POST', { date });
	}
	$: freeWorkplacesPromise = getWorkplaces(date);

	async function addReservation() {
		const r = await protectedApiFetch('/add-reservation', 'PUT', {
			date,
			workplaceNumber: selectedWorkplaceNumber
		});
		console.log(r);
		date = undefined;
	}

	let selectedWorkplaceNumber = 1;
</script>

{#if !$authStore}
	{goto('/')}
{:else}
	<Modal
		size="sm"
		open={date !== undefined}
		modalHeading="Take Workplace"
		primaryButtonText="Make reservation"
		secondaryButtonText="Cancel"
		preventCloseOnClickOutside
		hasForm
		on:open
		on:submit={addReservation}
	>
		{#if date}
			{#await freeWorkplacesPromise}
				loading
			{:then { workplaces }}
				<p>{date}</p>
				<br />

				<Select
					id="SelectNumber"
					labelText="Select workspace"
					bind:selected={selectedWorkplaceNumber}
				>
					{#each workplaces as { description, workplaceNumber }}
						<SelectItem value={workplaceNumber} text={description} />
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
{/if}
