<script lang="ts">
	import { apiFetch } from '$lib/scripts';
	import type { AuthData } from '$common/RequestTypes';
	import type { StatusResponse } from '$common/ResponseTypes';
	import {
		Button,
		ButtonSet,
		Column,
		Form,
		Grid,
		Modal,
		PasswordInput,
		Row,
		TextInput,
		Tile
	} from 'carbon-components-svelte';

	let username = '';
	let password = '';

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const body: AuthData = { username, password };
		const response = await apiFetch('/login', 'POST', body);
		const json: StatusResponse = await response.json();
		console.log(json.status);
	}
</script>

<Grid>
	<Row>
		<Column />
		<Column>
			<Tile>
				<Form on:submit={handleSubmit}>
					<h1>Main page</h1>
					<TextInput
						bind:value={username}
						labelText="User name"
						placeholder="Enter user name..."
						required
					/>
					<PasswordInput
						bind:value={password}
						required
						type="password"
						labelText="Password"
						placeholder="Enter password..."
					/>
					<ButtonSet>
						<Button kind="secondary">Cancel</Button>
						<Button>Submit</Button>
					</ButtonSet>
				</Form>
			</Tile>
		</Column>
		<Column />
	</Row>
</Grid>
<Modal />
