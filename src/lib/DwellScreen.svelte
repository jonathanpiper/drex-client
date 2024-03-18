<script lang="ts">
	import { fade } from "svelte/transition"
	import { onMount } from "svelte"
	import { state, MEDIAPATH } from "../store"
	import { DWELLROTATE, DWELLTIMEOUT } from "../const"
	import { createEventDispatcher } from "svelte"

	export let dwellImages: []

	var dwellCount: number = 0
	let dwellScreenActive: boolean = false

	const dispatch = createEventDispatcher()

	const stopDwellScreen = () => {
		dwellScreenActive = false
		dispatch("resetState")
	}

	function idleTimer() {
		var t
		window.onload = resetTimer
		window.onmousedown = resetTimer // catches mouse movements
		window.onclick = resetTimer // catches mouse clicks
		window.onscroll = resetTimer // catches scrolling
		window.onkeydown = resetTimer //catches keyboard actions

		function setDwellScreen() {
			if ($state.playPause === "Play" && $state.playPauseAudio === "Play") {
                console.log('setting dwell screen')
				dwellScreenActive = true
				rotateDwellImage()
				setTimeout($state.reset, 2000)
			} else {
				resetTimer()
			}
		}

		function rotateDwellImage() {
			clearTimeout(t)
			t = setTimeout(incrementDwellCount, DWELLROTATE * 1000)
		}

		function incrementDwellCount() {
			if (dwellCount === dwellImages.length - 1) {
				dwellCount = 0
			} else {
				dwellCount = dwellCount + 1
			}
			rotateDwellImage()
		}

		function resetTimer() {
			clearTimeout(t)
			t = setTimeout(setDwellScreen, DWELLTIMEOUT * 1000)
		}
		resetTimer()
	}

	onMount(async () => {
		idleTimer()
	})
</script>

{#if dwellScreenActive}
	<div class="dwell-screen" on:click={stopDwellScreen} on:keydown={stopDwellScreen} in:fade={{ duration: 2000 }} out:fade={{ duration: 500 }}>
		<div class="dwell-bounding-box">
			<div class="dwell-text-banner bounce">
				<h2>TOUCH SCREEN TO BEGIN</h2>
			</div>
		</div>
		{#each dwellImages as image, index}
			<img class="dwell-image {index == dwellCount ? 'visible' : 'hidden'}" src={$MEDIAPATH + image} alt="Dwell screen" />
		{/each}
	</div>
{/if}

<style>
	.dwell-bounding-box {
		width: calc(100% - 400px);
		height: calc(100% - 200px);
		display: flex;
		/* flex-flow: row; */
		align-items: flex-end;
		justify-items: flex-end;
		margin: auto;
		z-index: 9999;
	}
	.dwell-text-banner {
		width: 1600px;
		display: flex;
		justify-content: center;
	}
	.bounce {
		animation: bounce 60s linear 100;
		transform-origin: 50% 80%;
		transform-box: view-box;
	}
	@keyframes bounce {
		0% {
			transform: translate(0%, 0%);
		}
		50% {
			transform: translate(1440px, 0%);
		}
		100% {
			transform: translate(0%, 0%);
		}
	}
	.dwell-screen {
		color: white;
		background-color: black;
		display: block;
		position: absolute;
		display: flex;
		align-content: flex-end;
		margin: 0px;
		width: 3440px;
		height: 1440px;
		z-index: 9999;
	}

	.dwell-screen h2 {
		font-family: var(--dr-body-font);
		font-size: 96pt;
		margin: 0;
	}

	:global(.visible) {
		visibility: visible;
		opacity: 1;
		transition: opacity 2s linear;
	}

	:global(.hidden) {
		visibility: hidden;
		opacity: 0;
		transition:
			visibility 0s 2s,
			opacity 2s linear;
	}

	.dwell-screen img {
		position: absolute;
		top: 0;
		left: 0;
		object-fit: fill;
	}
</style>
