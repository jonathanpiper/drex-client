<script lang="ts">
	import { loadData, setRailStyles } from "./functions"
	import { previewIdentifier, MEDIAPATH, state } from "./store"
	import { onMount } from "svelte"
	import DigitalRail from "./lib/DigitalRail.svelte"
	import DwellScreen from "./lib/DwellScreen.svelte"
	import LoadingScreen from "./lib/LoadingScreen.svelte"

    console.log('Build version 4-6-24')

    const params = new URLSearchParams(window.location.search)
    if (params.has('preview')) {
        $previewIdentifier = params.get('preview')
        console.log($MEDIAPATH)
    }

	let Rail, Config, railDefinition
	const webSocket = new WebSocket("ws://192.168.168.180:9000")
	webSocket.onmessage = (event) => {
		const wsMessage = event.data.replace(/["]/g, "")
		console.log(wsMessage)
		if (wsMessage == "forceRefresh") {
			console.log("Received reload message from DREX server.")
			window.location.reload()
		} else {
			console.log(`Unrecognized message from DREX server: ${wsMessage}`)
		}
	}
	onMount(async () => {
	    const promise = await loadData($previewIdentifier)
		Rail = promise.rail
		Config = promise.config
		railDefinition = {
			identifier: Rail.identifier,
			shortIdentifier: Rail.identifier.substring(4),
			get gallery() {
				return this.shortIdentifier.substring(0, 1)
			},
		}
		setRailStyles(document.body.style, Config, `gallery${railDefinition.gallery}`)
	})

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
		$state.activePrimary = null
		$state.activeSecondary = null
		$state.activeTertiary = null
		$state.activeImage = 0
        $state.playPause = "Play"
        $state.playPauseAudio = "Play"
	}
</script>

<svelte:head>
	<title>Museum of Making Music Digital Rail {railDefinition?.shortIdentifier}</title>
</svelte:head>

{#if !Rail}
	<LoadingScreen identifier={railDefinition?.identifier} />
{:else}
	<DwellScreen dwellImages={Rail.dwell.images} on:resetState={resetState} />
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
</style>
