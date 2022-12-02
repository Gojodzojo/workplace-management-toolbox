<script lang="ts">
	import type { Workplace } from '$common/types';
	import { Modal, 
		Select,
    SelectItem, 
	} from 'carbon-components-svelte';

	export let open = false;

	let workplace: Workplace[] = [
		{number: 1, description: "this is description for workplace 1"},
		{number: 2, description: "this is description for workplace 2"},
		{number: 3, description: "this is description for workplace 3"}
	];
	let selectValue = 1;

	$: selectedWorkplace = workplace.find(w => w.number == selectValue)!;
</script>

<Modal
	size="sm"
	bind:open
	modalHeading="Take Workplace"
	primaryButtonText="submit"
	hasForm
	on:open
	on:close
	on:submit
>
	<Select id="SelectNumber" labelText="Select workspace" bind:selected={selectValue}>
		{#each workplace as { number }}
			<SelectItem value={number}/>
 		{/each}
	</Select>

	<p>{selectedWorkplace.description}</p>
</Modal>

<style>
	:global(.bx--modal-content) {
		overflow: hidden !important;
	}
</style>
