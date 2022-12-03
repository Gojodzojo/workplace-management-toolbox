<script lang="ts">
	import { Button, Column, Grid, Row, DataTable } from 'carbon-components-svelte';
	import { authStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { apiFetch, protectedApiFetch } from '$lib/scripts';
	import type { GetUserReservationsResponse, ReservationInResponse } from '$common/ResponseTypes';

	async function getWorkplaces() {
		return await protectedApiFetch('/get-user-reservations', 'POST');
	}

	function toRows(reservation: ReservationInResponse) {
		console.log(reservation);
		return { ...reservation, id: reservation.date };
	}
</script>

{#if !$authStore}
	{goto('/')}
{:else}
	<Grid>
		<Row>
			<Column>
				<h1>User page</h1>
				<!-- <Button on:click={() => ($authStore = undefined)} kind="danger">Logout</Button> -->
			</Column>
		</Row>
		<br />
		<Row>
			<Column id="tableContainer">
				{#await getWorkplaces()}
					loading
				{:then { reservations }}
					<DataTable
						class="table"
						headers={[
							{ key: 'date', value: 'Date' },
							{ key: 'workplaceNumber', value: 'Workplace' }
						]}
						rows={reservations.map(toRows)}
					/>
				{/await}
			</Column>
		</Row>
	</Grid>
{/if}

<style>
	:global(.bx--grid) {
		width: fit-content;
		height: fit-content;
	}
	:global(.table) {
		width: 50vw;
	}
	:global(.tableContainer) {
		display: flex;
		justify-content: center;
	}
</style>
