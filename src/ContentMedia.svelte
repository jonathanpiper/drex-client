<script>
	import { state, config, substitutions } from "./stores.js"
	import SvelteMarkdown from "svelte-markdown"
	import { afterUpdate } from "svelte"

	var video

	function setActiveObject(value) {
		if ($state.activeObject._type == "custom") {
			$state.activeSecondary = {}
		}
		$state.activeObject = value
		$state.playPause = "Play"
	}

	function toggleVideo() {
		if (!video) {
			video = document.getElementById("video")
			console.log(video)
		}
		if (video) {
			if (video.paused) {
				video.play()
				// $state.playPause = 'Pause';
			} else {
				video.pause()
				// $state.playPause = 'Play';
			}
		}
	}

	function checkVideo() {
		if (video && $state.activeObject.hasOwnProperty("items")) {
			if (video.children[0].getAttribute("src") != $config.localMediaPath + $state.activeObject.items[0].clip) {
				video.load()
				video.pause()
				video.load()
			}
		}
	}

	$: $state.activeObject, checkVideo()

	afterUpdate(() => {
		video = document.getElementById("video")
		if (video) {
			video.addEventListener("ended", function () {
				const event = new MouseEvent("click", { bubbles: true, view: window })
				document.getElementById("digital-rail").dispatchEvent(event)
				setActiveObject(false)
			})
			video.addEventListener("play", function () {
				$state.playPause = "Pause"
			})
			video.addEventListener("pause", function () {
				$state.playPause = "Play"
			})
		}
	})
</script>

<div class="dr-content-media">
	{#if $state.activeSecondary}
		{#if $state.activeSecondary._type != "custom"}
			<div class="dr-content-media-header">
				<h2 class="dr-content-media-header-title{$state.activeSecondary.summary ? '-small-margin' : ''}">
					{$substitutions.has($state.activeSecondary._type) ? $substitutions.get($state.activeSecondary._type) : $state.activeSecondary.title}
				</h2>
			</div>
		{/if}
		{#if Object.keys($state.activeObject).length > 0}
			<video id="video" autoplay>
				<source
					src="{$config.localMediaPath}{$state.activeObject._type == 'custom' ? $state.activeObject.items[0].clip : $state.activeObject.clip}"
					type="video/mp4"
				/>
				<track src="" kind="captions" />
			</video>
			{#if $state.activeObject.staticClip}
				<div class="dr-content-media-overlay-static-clip">
					{#if $state.activeObject.title}
						<p><strong>“{$state.activeObject.title}”</strong></p>
					{/if}
					{#if $state.activeObject.person}
						<p>{$state.activeObject.person}{$state.activeObject.year ? ", " + $state.activeObject.year : ""}</p>
					{/if}
				</div>
			{:else}
				<div class="dr-content-media-overlay-{$state.activeSecondary._type}">
					{#if $state.activeObject.artist}
						<h2>{$state.activeObject.artist}{$state.activeObject.year ? ", " + $state.activeObject.year : ""}</h2>
					{/if}
					{#if $state.activeObject.title && $state.activeObject._type === "musicalMoments"}
						<h2>“{$state.activeObject.title}”</h2>
					{:else if $state.activeObject.title && $state.activeObject._type === "factoryFootage"}
						<h2>{$state.activeObject.caption}</h2>
					{:else if $state.activeObject._type !== 'custom'}
						<h2>{$state.activeObject.title}</h2>
					{/if}
					{#if $state.activeObject.instrument}
						<h2>{$state.activeObject.instrument}</h2>
					{/if}
					{#if $state.activeObject.credit}
						<h2>{$state.activeObject.credit}</h2>
					{/if}
					{#if $state.activeSecondary._type == "custom"}
						<h2>{$state.activeSecondary.items[0].label}</h2>
					{/if}
				</div>
			{/if}
			<div class="dr-content-media-controls">
				{#if $state.activeSecondary.items.length > 1}
					<div class="dr-content-media-control-item" on:click={() => setActiveObject(false)}>
						<p>Video Menu</p>
					</div>
				{/if}
				<div class="dr-content-media-control-item" on:click={() => toggleVideo()}>
					<p>{$state.playPause}</p>
				</div>
			</div>
		{:else}
			{#if $state.activeSecondary.summary}
				<div class="dr-content-media-summary">
					<SvelteMarkdown source={$state.activeSecondary.summary} />
				</div>
			{/if}
			<div class="dr-content-media-list">
				{#each $state.activeSecondary.items as item}
					<div class="dr-content-media-wrapper">
						<div class="dr-content-media-item-{$state.activeSecondary._type}" on:click={() => setActiveObject(item)}>
							<img src="{$config.localMediaPath}{item.thumbnail}" alt={item.title || item.label} />
							{#if $state.activeSecondary._type == "musicalMoments"}
								<h2>“{item.title}”</h2>
								<h2>{item.artist}</h2>
							{:else if $state.activeSecondary._type == "factoryFootage" || "oralHistories"}
								<h2>{item.title}</h2>
							{/if}
						</div>
						{#if $state.activeSecondary._type == "oralHistories"}<p>
								{item.summary}
							</p>{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
{#if $state.activeSecondary === false}
	<img id="instruction-media" src="{$config.localMediaPath}INSTRUCTION-MEDIA.png" alt="Choose a category" />
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
	}

	div[class^="dr-content-media-item-"]:not(.dr-content-media-item-musicalMoments) h2 {
		font-family: var(--dr-body-font);
		font-size: 34px;
		font-weight: normal;
		margin: 20px 20px;
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
