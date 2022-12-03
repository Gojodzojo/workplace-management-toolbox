<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores';
	import {
		Header,
		HeaderAction,
		HeaderPanelDivider,
		HeaderPanelLink,
		HeaderPanelLinks,
		HeaderUtilities,
		SkipToContent,
		Button
	} from 'carbon-components-svelte';
	import AuthModal from './AuthModal.svelte';

	let isSideNavOpen = false;
	let isMenuOpen = false;
	let isAuthModalOpen = false;

	function handleProfileClick() {
		if ($authStore) {
			goto('/user');
		} else {
			isAuthModalOpen = true;
		}
		isMenuOpen = false;
	}
</script>

<Header bind:isSideNavOpen>
	<Button style="logo" href="/" kind="ghost">Workplace Management Toolbox</Button>

	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>

	<HeaderUtilities>
		<HeaderAction bind:isOpen={isMenuOpen}>
			<HeaderPanelLinks>
				{#if $authStore}
					<HeaderPanelLink
						href="/workplace_form"
						on:click={() => {
							isMenuOpen = false;
						}}>Reserve workplace</HeaderPanelLink
					>
					<HeaderPanelLink
						href="/user"
						on:click={() => {
							isMenuOpen = false;
						}}>My profile</HeaderPanelLink
					>
					<HeaderPanelDivider />
					<HeaderPanelLink href="/" on:click={() => ($authStore = undefined)}
						>Log out</HeaderPanelLink
					>
				{:else}
					<HeaderPanelLink on:click={handleProfileClick}>Log in</HeaderPanelLink>
				{/if}
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<AuthModal bind:open={isAuthModalOpen} />

<style>
	:global(header a.bx--header__name) {
		display: none !important;
	}

	:global(header .bx--btn) {
		font-weight: bolder !important;
		color: white;
	}
</style>
