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
		console.log(reservation);
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
							{ key: 'workplaceNumber', value: 'Workplace' },
							{ key: 'delRes', value: 'Del Res' }
						]}
						rows={reservations.map(toRows)}
					/>
				{/await}
			</Column>
			<Column class="userContent">
				<Row><Tile><h3>Temperature: {temperature}</h3></Tile></Row>
				<Row><Tile>some content</Tile></Row>
				<Row><Tile>some content</Tile></Row>
			</Column>
		</Row>
	</Grid>
{/if}

<style>
	:global(.bx--grid) {
		width: 100%;
		height: 100vh;
	}
	:global(.table) {
		width: 40vw;
	}
	:global(.tableContainer) {
		display: flex;
		justify-content: center;
	}
	:global(.bx--tile){
		width: 100%;
		margin: 5px;
	}
	:global(.userContent){
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
</style>
