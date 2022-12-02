<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores';
	import {
		Header,
		HeaderAction,
		HeaderGlobalAction,
		HeaderPanelDivider,
		HeaderPanelLink,
		HeaderPanelLinks,
		HeaderUtilities,
		SideNav,
		SideNavItems,
		SideNavLink,
		SideNavMenu,
		SideNavMenuItem,
		SkipToContent
	} from 'carbon-components-svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';
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
	}
</script>

<Header
	persistentHamburgerMenu={true}
	company="IBM"
	platformName="Carbon Svelte"
	bind:isSideNavOpen
>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>

	<HeaderUtilities>
		<HeaderGlobalAction
			aria-label="Settings"
			icon={UserAvatarFilledAlt}
			on:click={handleProfileClick}
		/>

		<HeaderAction bind:isOpen={isMenuOpen}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
				<HeaderPanelLink>Switcher item 1</HeaderPanelLink>
				<HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
				<HeaderPanelLink>Switcher item 1</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 2</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 3</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 4</HeaderPanelLink>
				<HeaderPanelLink>Switcher item 5</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
	<SideNavItems>
		<SideNavLink text="Link 1" />
		<SideNavLink text="Link 2" />
		<SideNavLink text="Link 3" />
		<SideNavMenu text="Menu">
			<SideNavMenuItem href="/" text="Link 1" />
			<SideNavMenuItem href="/" text="Link 2" />
			<SideNavMenuItem href="/" text="Link 3" />
		</SideNavMenu>
	</SideNavItems>
</SideNav>

<AuthModal bind:open={isAuthModalOpen} />
