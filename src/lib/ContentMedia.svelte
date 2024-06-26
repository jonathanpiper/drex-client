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
		if (!video) {
			video = document.getElementById("video") as HTMLVideoElement
		}
		if (video) {
			if (video.paused) {
				video.play()
			} else {
				video.pause()
			}
		}
	}

	function checkVideo() {
		if (video && (MediaItem || Content?._type === "custom")) {
			if (![$MEDIAPATH + MediaItem?.clip, $MEDIAPATH + Content?.items[0]?.clip].includes(video.children[0].getAttribute("src"))) {
				video.load()
				video.pause()
				video.load()
			}
		}
	}

	$: if (Content?._type === "custom") {
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
					setTertiaryNavigation(null)
				})
				video.addEventListener("play", function () {
					$state.playPause = "Pause"
				})
				video.addEventListener("pause", function () {
					$state.playPause = "Play"
				})
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
						<h2 class="dr-content-media-overlay-static-title">“{MediaItem.title}”</h2>
					{/if}
					{#if MediaItem?.artist}
						<h2>{MediaItem.artist}{MediaItem.year ? ", " + MediaItem.year : ""}</h2>
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
						{#if MediaItem?.title && Content?._type === "musicalMoments"}
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
								<h2 class={item.artist.length > 30 ? "small" : ""}>{item.artist}</h2>
							{:else if Content?._type === "factoryFootage" || "oralHistories"}
								<h2 class={item.title.length > 20 ? "small" : ""}>{item.title}</h2>
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
	{#if Content === null}
		<img id="instruction-media" src="{$MEDIAPATH}INSTRUCTION-MEDIA.png" alt="Choose a category" />
	{/if}
</div>

<style>
	#instruction-media {
        margin-left: -94px;
        margin-top: 182px;
		width: auto;
		height: 420px;
	}
	.dr-content-media {
		margin: 58px;
		width: 2120px;
		height: 1320px;
		position: relative;
		z-index: 0;
		/* overflow: hidden; */
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
		line-height: 120%;
	}

	.dr-content-media-item-musicalMoments h2 {
		font-family: var(--dr-body-font);
		font-size: 24px;
		font-weight: normal;
		margin: 8px 20px;
		line-height: 1.2;
	}

	.dr-content-media-item-musicalMoments h2.small {
		font-size: 20px;
		letter-spacing: -1.5px;
	}

	div[class^="dr-content-media-item-"]:not(.dr-content-media-item-musicalMoments) h2 {
		font-family: var(--dr-body-font);
		font-size: 34px;
		font-weight: normal;
		margin: 18px 20px;
	}

	div[class^="dr-content-media-item-"]:not(.dr-content-media-item-musicalMoments) h2.small {
		font-size: 34px;
		letter-spacing: -1.2px;
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
		height: 1192.5px;
		object-fit: contain;
		z-index: 0;
	}

	.dr-content-media-overlay-musicalMoments {
		position: absolute;
		width: auto;
		bottom: 220px;
		z-index: 9;
	}

	div[class^="dr-content-media-overlay-"]:not(.dr-content-media-overlay-musicalMoments) {
		position: absolute;
		width: 1200px;
		bottom: 84px;
		z-index: 9;
	}

	div[class^="dr-content-media-overlay-"]:not(.dr-content-media-overlay-musicalMoments) h2 {
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
		position: relative !important;
		height: auto;
		width: 1000px !important;
		left: 940px;
		top: 334px;
	}
	.dr-content-media-overlay-static-clip h2 {
		font-size: 64px!important;
		font-family: var(--dr-body-font);
		margin: 0!important;
	}

    .dr-content-media-overlay-static-title {
        font-weight: bold!important;
    }
</style>
