<script lang="ts">
	import type { AuthData } from '$common/RequestTypes';
	import type { StatusResponse } from '$common/ResponseTypes';
	import { apiFetch } from '$lib/scripts';
	import { Modal, PasswordInput, TextInput } from 'carbon-components-svelte';

	export let open = false;
	let username = '';
	let password = '';

	async function login() {
		const body: AuthData = { username, password };
		const response = await apiFetch('/login', 'POST', body);
		const json: StatusResponse = await response.json();
		console.log(json.status);
	}

	async function register() {
		const body: AuthData = { username, password };
		const response = await apiFetch('/register', 'PUT', body);
		const json: StatusResponse = await response.json();
		console.log(json.status);
	}
</script>

<Modal
	size="sm"
	bind:open
	modalHeading="Login or register"
	primaryButtonText="Login"
	secondaryButtonText="Register"
	hasForm
	on:click:button--primary={login}
	on:click:button--secondary={register}
	on:open
	on:close
	on:submit
>
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
</Modal>

<style>
	:global(.bx--modal-content) {
		overflow: hidden;
	}
</style>
