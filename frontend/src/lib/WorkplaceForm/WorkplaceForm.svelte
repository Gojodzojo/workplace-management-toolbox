<script lang="ts">
	import type { Workplace } from '$common/types';
	import { formatDate } from '$lib/scripts';
	import { Modal, Select, SelectItem } from 'carbon-components-svelte';

	export let date: Date | undefined;

	let workplaces: Workplace[] = [
		{ number: 1, description: 'this is description for workplace 1' },
		{ number: 2, description: 'this is description for workplace 2' },
		{ number: 3, description: 'this is description for workplace 3' }
	];

	let selectedWorkplaceNumber = 1;
	$: selectedWorkplace = workplaces.find((w) => w.number == selectedWorkplaceNumber)!;
</script>

<Modal
	size="sm"
	open={date !== undefined}
	modalHeading="Take Workplace"
	primaryButtonText="Make reservation"
	hasForm
	on:open
	on:close
	on:submit
>
	{#if date}
		<p>{formatDate(date)}</p>

		<Select id="SelectNumber" labelText="Select workspace" bind:selected={selectedWorkplaceNumber}>
			{#each workplaces as { number }}
				<SelectItem value={number} />
			{/each}
		</Select>

		<p>{selectedWorkplace.description}</p>
	{/if}
</Modal>

<style>
	:global(.bx--modal-content) {
		overflow: hidden !important;
	}
</style>
