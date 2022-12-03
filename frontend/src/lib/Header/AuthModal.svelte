<script lang="ts">
	import { goto } from '$app/navigation';
	import type { AuthData } from '$common/RequestTypes';
	import { apiFetch } from '$lib/scripts';
	import { authStore, isAuthModalOpen } from '$lib/stores';
	import { Modal, PasswordInput, TextInput } from 'carbon-components-svelte';

	let username = '';
	let password = '';
	let errorBoxContent = '';

	async function login() {
		try {
			const body: AuthData = { username, password };
			const tokensOrStatus = await apiFetch('/login', 'POST', body);

			if ('status' in tokensOrStatus) {
				errorBoxContent = tokensOrStatus.status;
			} else {
				$authStore = tokensOrStatus;
				$isAuthModalOpen = false;
				username = '';
				password = '';
				goto('/user');
			}
		} catch (error) {
			console.error(error);
			errorBoxContent = 'Could not connect to server';
		}
	}

	async function register() {
		try {
			const body: AuthData = { username, password };
			const tokensOrStatus = await apiFetch('/register', 'PUT', body);

			if ('status' in tokensOrStatus) {
				errorBoxContent = tokensOrStatus.status;
			} else {
				$authStore = tokensOrStatus;
				$isAuthModalOpen = false;
				username = '';
				password = '';
				goto('/user');
			}
		} catch (error) {
			console.error(error);
			errorBoxContent = 'Could not connect to server';
		}
	}
</script>

<Modal
	size="sm"
	bind:open={$isAuthModalOpen}
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
	<p>{errorBoxContent}</p>
</Modal>

<style>
	:global(.bx--modal-content) {
		overflow: hidden !important;
	}
</style>
