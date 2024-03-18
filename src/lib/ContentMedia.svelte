<script lang="ts">
	import { state, MEDIAPATH } from "../store"
	import { SUBSTITUTIONS } from "../const"
	import SvelteMarkdown from "svelte-markdown"
	import { marked } from "marked"
	import { afterUpdate } from "svelte"
	import { construct_svelte_component } from "svelte/internal"

	export let Content
	let MediaItem = null

	var video

	const setTertiaryNavigation = (value) => {
        video = null
		$state.activeTertiary = value
		MediaItem = Content.items[$state.activeTertiary]
		$state.playPause = "Play"
	}

	function toggleVideo() {
		console.log("trying to toggle")
		if (!video) {
			video = document.getElementById("video") as HTMLVideoElement
			console.log("got video")
		}
		if (video) {
			if (video.paused) {
				video.play()
			} else {
				console.log("pause!", video)
				video.pause()
			}
		}
	}

	function checkVideo() {
		console.log("check video", $state.playPause, video)
		if (video && ( MediaItem || Content?._type === "custom")) {
			if (![$MEDIAPATH + MediaItem?.clip, $MEDIAPATH + Content?.items[0]?.clip].includes(video.children[0].getAttribute("src"))) {
                console.log('hey')
				video.load()
				video.pause()
				video.load()
			}
		}
	}

    $: if (Content?._type === "custom") {
        console.log('custom!')
        checkVideo()
    }

	$: if (MediaItem !== null) checkVideo()

	$: if ($state.activeTertiary === null) MediaItem = null

	afterUpdate(() => {
		if (!video) {
			video = document.getElementById("video") as HTMLVideoElement
			if (video) {
				video.addEventListener("ended", function () {
					const event = new MouseEvent("click", { bubbles: true, view: window })
					document.getElementById("digital-rail").dispatchEvent(event)
					console.log("ended")
					setTertiaryNavigation(null)
				})
				video.addEventListener("play", function () {
					$state.playPause = "Pause"
				})
				video.addEventListener("pause", function () {
					$state.playPause = "Play"
				})
				console.log("gotta play")
				video.play()
			}
		}
	})
</script>

<div class="dr-content-media">
	{#if $state.activeSecondary !== null}
		{#if Content?._type !== "custom"}
			<div class="dr-content-media-header">
				<h2 class="dr-content-media-header-title{Content.summary ? '-small-margin' : ''}">
					{SUBSTITUTIONS.hasOwnProperty(Content._type) ? SUBSTITUTIONS[Content._type] : Content.title}
				</h2>
			</div>
		{/if}
		{#if MediaItem !== null || Content._type === "custom"}
			<video id="video" autoplay>
				<source src="{$MEDIAPATH}{Content._type === 'custom' ? Content.items[0].clip : MediaItem.clip}" type="video/mp4" />
				<track src="" kind="captions" />
			</video>
			{#if MediaItem?.staticClip}
				<div class="dr-content-media-overlay-static-clip">
					{#if MediaItem?.title}
						<p><strong>“{MediaItem.title}”</strong></p>
					{/if}
					{#if MediaItem?.artist}
						<p>{MediaItem.artist}{MediaItem.year ? ", " + MediaItem.year : ""}</p>
					{/if}
				</div>
			{:else}
				<div class="dr-content-media-overlay-{Content._type}">
					{#if Content?._type === "custom"}
						<h2>{Content.items[0].label}</h2>
					{:else}
						{#if MediaItem?.artist}
							<h2>{MediaItem.artist}{MediaItem.year ? ", " + MediaItem.year : ""}</h2>
						{/if}
						{#if MediaItem?.title && MediaItem?._type === "musicalMoments"}
							<h2>“{MediaItem?.title}”</h2>
						{:else if MediaItem?.title && MediaItem?._type === "factoryFootage"}
							<h2>{MediaItem.caption}</h2>
						{:else if MediaItem?._type !== "custom"}
							<h2>{MediaItem?.title}</h2>
						{/if}
						{#if MediaItem?.instrument}
							<h2>{MediaItem.instrument}</h2>
						{/if}
						{#if MediaItem?.credit}
							<h2>{MediaItem.credit}</h2>
						{/if}
					{/if}
				</div>
			{/if}
			<div class="dr-content-media-controls">
				{#if Content.items.length > 1}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="dr-content-media-control-item" on:click={() => setTertiaryNavigation(null)}>
						<p>Video Menu</p>
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
				{/if}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="dr-content-media-control-item" on:click={toggleVideo}>
					<p>{$state.playPause}</p>
				</div>
			</div>
		{:else}
			{#if Content.summary}
				<div class="dr-content-media-summary">
					<div>{@html marked.parse(Content.summary)}</div>
				</div>
			{/if}
			<div class="dr-content-media-list">
				{#each Content.items as item, index}
					<div class="dr-content-media-wrapper">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div class="dr-content-media-item-{Content._type}" on:click={() => setTertiaryNavigation(index)}>
							<img src="{$MEDIAPATH}{item.thumbnail}" alt={item.title || item.label} />
							{#if Content?._type === "musicalMoments"}
								<h2>“{item.title}”</h2>
								<h2>{item.artist}</h2>
							{:else if Content?._type === "factoryFootage" || "oralHistories"}
								<h2>{item.title}</h2>
							{/if}
						</div>
						{#if Content?._type == "oralHistories"}<p>
								{item.summary}
							</p>{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
{#if Content === null}
	<img id="instruction-media" src="{$MEDIAPATH}INSTRUCTION-MEDIA.png" alt="Choose a category" />
{/if}

<style>
	#instruction-media {
		position: fixed;
		top: 300px;
		left: 1220px;
		width: auto;
		height: 420px;
	}
	.dr-content-media {
		margin: 58px;
		width: 2120px;
		height: 1320px;
		position: relative;
		z-index: 0;
	}

	:global(.dr-content-media-header) {
		z-index: 9;
		position: relative;
	}

	:global(.dr-content-media-header-title) {
		position: relative;
		font-family: var(--dr-body-font);
		font-weight: 600;
		font-size: 64px;
		margin: 0px;
		margin-top: 20px;
		margin-bottom: 80px;
		z-index: 9;
	}

	:global(.dr-content-media-header-title-small-margin) {
		position: relative;
		font-family: var(--dr-body-font);
		font-weight: 600;
		font-size: 64px;
		margin: 0px;
		margin-top: 20px;
		margin-bottom: 40px;
		z-index: 9;
	}

	.dr-content-media-summary {
		font-family: var(--dr-body-font);
		font-size: 32px;
	}

	.dr-content-media-list {
		display: flex;
		flex-flow: row wrap;
		/* row-gap: 40px;
    column-gap: 50px; */
	}

	div[class^="dr-content-media-item-"] {
		width: 454px;
		height: 341px;
		background-color: var(--dr-gallery-color);
		border: 4px solid;
		border-color: black;
		margin-right: 50px;
	}

	div[class^="dr-content-media-item-"]:nth-child(4n) {
		margin-right: 0px;
	}

	.dr-content-media-wrapper {
		width: 454px;
		margin-bottom: 40px;
		margin-right: 50px;
	}
	.dr-content-media-wrapper:nth-child(4n) {
		margin-right: 0px;
	}

	.dr-content-media-wrapper p {
		font-family: var(--dr-body-font);
		font-size: 24px;
		margin-top: 20px;
		margin-bottom: 0px;
		margin-left: 10px;
		margin-right: 10px;
		line-height: 150%;
	}

	.dr-content-media-item-musicalMoments h2 {
		font-family: var(--dr-body-font);
		font-size: 24px;
		font-weight: normal;
		margin: 8px 20px;
		line-height: 1.2;
	}

	div[class^="dr-content-media-item-"]:not(.dr-content-media-item-musicalMoments) h2 {
		font-family: var(--dr-body-font);
		font-size: 34px;
		font-weight: normal;
		margin: 18px 20px;
	}

	div[class^="dr-content-media-item-"] img {
		width: 100%;
		height: 250px;
		object-fit: cover;
		object-position: right bottom;
	}

	video {
		display: block;
		position: absolute;
		top: -58px;
		left: -58px;
		width: 2120px !important;
		height: auto !important;
		object-fit: cover;
		z-index: 0;
	}

	.dr-content-media-overlay-musicalMoments {
		position: absolute;
		width: 1200px;
		bottom: 220px;
		z-index: 9;
	}

	.dr-content-media-overlay-custom {
		position: absolute;
		width: 1200px;
		bottom: 90px;
		z-index: 9;
	}

	.dr-content-media-overlay-factoryFootage {
		position: absolute;
		width: 1200px;
		bottom: 90px;
		z-index: 9;
	}

	.dr-content-media-overlay-oralHistories {
		position: absolute;
		width: 1200px;
		bottom: 90px;
		z-index: 9;
	}

	.dr-content-media-overlay-oralHistories h2 {
		font-family: var(--dr-body-font);
		font-size: 48px;
		font-weight: normal;
		margin: 6px 0px;
	}

	.dr-content-media-overlay-factoryFootage h2 {
		font-family: var(--dr-body-font);
		font-size: 48px;
		font-weight: normal;
		margin: 6px 0px;
	}

	.dr-content-media-overlay-custom h2 {
		font-family: var(--dr-body-font);
		font-size: 48px;
		font-weight: normal;
		margin: 6px 0px;
	}

	.dr-content-media-overlay-musicalMoments h2 {
		font-family: var(--dr-body-font);
		font-size: 36px;
		font-weight: normal;
		margin: 6px 0px;
	}

	.dr-content-media-controls {
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-end;
		/* column-gap: 30px; */
		position: absolute;
		bottom: 55px;
		width: 100%;
		height: 100px;
	}

	:global(.dr-content-media-control-item) {
		display: flex;
		justify-content: center;
		margin-left: 30px;
		width: 220px;
		height: 60px;
		font-family: var(--dr-body-font);
		font-size: 24px;
		font-weight: normal;
		color: black;
		border-radius: 50px;
		background-color: #bfbfbf;
	}

	:global(.dr-content-media-control-item p) {
		align-self: center;
		margin: 0px;
	}
	.dr-content-media-overlay-static-clip {
		position: absolute;
		left: 1035px;
		top: 434px;
	}
	.dr-content-media-overlay-static-clip p {
		font-size: 64px;
		font-family: var(--dr-body-font);
		margin: 0;
	}
</style>
