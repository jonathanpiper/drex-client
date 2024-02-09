<script lang="ts">
	import { loadData, setRailStyles } from "./functions"
	import { state } from "./store"
	import DigitalRail from "./lib/DigitalRail.svelte"
	import DwellScreen from "./lib/DwellScreen.svelte"
	import LoadingScreen from "./lib/LoadingScreen.svelte"

	const { rail: Rail, config: Config } = loadData
	const railDefinition = {
		identifier: Rail.identifier,
		shortIdentifier: Rail.identifier.substring(4),
		get gallery() {
			return this.shortIdentifier.substring(0, 1)
		},
	}
	setRailStyles(document.body.style, Config, `gallery${railDefinition.gallery}`)
	const setPrimary = (e: any) => {
        resetState()
		$state.activePrimary = e.detail
	}
    const setSecondary = (e: any) => {
		$state.activeSecondary = e.detail
        $state.activeTertiary = null
	}
	const resetState = () => {
		$state.reset()
        console.log($state)
		$state.activePrimary = null
        $state.activeSecondary = null
        $state.activeTertiary = null
        $state.activeImage = 0
	}
</script>

<svelte:head>
	<title>Museum of Making Music Digital Rail {railDefinition.shortIdentifier}</title>
</svelte:head>

{#if !Rail}
	<LoadingScreen identifier={railDefinition.identifier} />
{:else}
	<DwellScreen dwellImages={Rail.dwell.images} />
	<DigitalRail {Rail} on:resetState={resetState} on:setPrimary={setPrimary} on:setSecondary={setSecondary} />
{/if}

<style>
	:global(:root) {
		--dr-title-font: "";
		--dr-body-font: "";
		--dr-gallery-color: "";
		--dr-gallery-color-active: "";
		--dr-gallery-color-dateRange: "";
	}

	:global(.active) {
		border: solid 4px white !important;
		background-color: var(--dr-gallery-color-active) !important;
	}

	:global(img) {
		user-select: none;
		-moz-user-select: none;
		-webkit-user-drag: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}

	:global(html) {
		background-color: black;
		/* cursor: none !important; */
	}

	/* :global(*) {
		cursor: none !important;
    } */

	@font-face {
		font-family: "Montserrat";
		src: url("/mediapool/Montserrat-VariableFont_wght.ttf") format("truetype");
	}

	@font-face {
		font-family: "Signika";
		src: url("/mediapool/Signika-VariableFont_wght.ttf") format("truetype");
	}

	@font-face {
		font-family: "OpenSans";
		src: url("/mediapool/OpenSans-VariableFont_wdthwght.ttf") format("truetype");
	}
</style>
