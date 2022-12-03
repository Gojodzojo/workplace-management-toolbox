<script lang="ts">
	import { Button, Column, Grid, Row, DataTable, Tile } from 'carbon-components-svelte';
	import { authStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { apiFetch, protectedApiFetch } from '$lib/scripts';
	import type { GetUserReservationsResponse, ReservationInResponse } from '$common/ResponseTypes';

	async function getWorkplaces() {
		return await protectedApiFetch('/get-user-reservations', 'POST');
	}

	function toRows(reservation: ReservationInResponse) {
		return { ...reservation, id: reservation.date, delRes: "delete" };
	}

	let temperature = 24;
</script>

{#if !$authStore}
	{goto('/')}
{:else}
	<Grid>
		<Row>
			<Column>
				<h1>Your reservations</h1>
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
							{ key: 'workplaceNumber', value: 'Workplace' },
							{ key: 'delRes', value: 'Del Res' }
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
		width: 100%;
		height: 100vh;
		display:flex;
		flex-direction: column;
		align-items: center;
	}
	:global(.table) {
		width: 50vw;
	}
	:global(.tableContainer) {
		display: flex;
		justify-content: center;
	}

	
</style>
