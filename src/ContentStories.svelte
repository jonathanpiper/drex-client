<script>
	import { state, config } from "./stores.js"
	import SvelteMarkdown from "svelte-markdown"
	import { afterUpdate } from "svelte"

	$state.playPause = "Pause"

	function setActiveImage(value) {
		$state.activeImage = value
		if ($state.activeObject.storyMedia[$state.activeImage].video) {
			var video = document.getElementById("video")
			$state.playPause = "Pause"
			video.pause()
			video.load()
			video.play()
		}
	}

	function toggleAudio() {
		var audio = document.getElementById("audio")
		if (audio.paused) {
			audio.play()
			$state.playPauseAudio = "Pause"
		} else {
			audio.pause()
			$state.playPauseAudio = "Play"
		}
	}

	function toggleVideo() {
		var video = document.getElementById("video")
		if (video.paused) {
			video.play()
			$state.playPause = "Pause"
		} else {
			video.pause()
			$state.playPause = "Play"
		}
	}
</script>

<div class="dr-content-stories">
	{#if $state.activeSecondary !== false}
		<div class="dr-content-story-text{$state.activeObject.body.length / 60 > 21 ? '-small-pad' : ''}">
			<h2 class="dr-content-story-title{$state.activeObject.body.length / 60 > 21 ? '-small-margin' : ''}">{$state.activeObject.title}</h2>
			<div class="dr-content-story-body{$state.activeObject.body.length / 60 > 27 ? '-tiny' : $state.activeObject.body.length / 60 > 21 ? '-small' : ''}">
				<SvelteMarkdown source={$state.activeObject.body} />
			</div>
			<!-- {@html $state.activeObject.body.replace(" – ", "&mdash;")} -->
			{#if $state.activeObject.inlineAudioClip}
				<audio id="audio" src="{$config.localMediaPath}{$state.activeObject.inlineAudioClip.clip}" />
				<div class="dr-content-audio-controls">
					<div class="dr-content-audio-control-item" on:click={() => toggleAudio()}>
						<p>
							{$state.activeObject.inlineAudioClip.label}
						</p>
					</div>
				</div>
			{/if}
		</div>
		<div class="dr-content-story-image">
			{#if $state.activeObject.hasOwnProperty("storyMedia")}
				{#if $state.activeObject.storyMedia[$state.activeImage].full}
					<div class="dr-content-story-image-container{$state.activeObject.storyMedia.length === 1 ? '-nothumb' : ''}">
						<img id="storyImage" src="{$config.localMediaPath}{$state.activeObject.storyMedia[$state.activeImage].full}" alt="Story" />
						{#if !["", null].includes($state.activeObject.storyMedia[$state.activeImage].caption)}
							<div class="dr-content-story-image-caption">
								<SvelteMarkdown source={$state.activeObject.storyMedia[$state.activeImage].caption} />
							</div>
						{/if}
					</div>
				{:else}
					<div class="dr-content-video-player">
						<video id="video" autoplay>
							<source src="{$config.localMediaPath}{$state.activeObject.storyMedia[$state.activeImage].video}" type="video/mp4" />
							<track src="" kind="captions" />
						</video>
						<div class="dr-content-media-controls">
							{#if $state.activeObject.storyMedia[$state.activeImage].caption != ""}
								<div class="dr-content-media-caption">
									<SvelteMarkdown source={$state.activeObject.storyMedia[$state.activeImage].caption} />
								</div>
							{/if}
							<div class="dr-content-media-control-item" on:click={() => toggleVideo()}>
								<p>{$state.playPause}</p>
							</div>
						</div>
					</div>
				{/if}
				{#if $state.activeObject.storyMedia[$state.activeImage].thumbnail != "" && $state.activeObject.storyMedia.length > 1}
					<div class="dr-content-story-image-selections">
						{#each $state.activeObject.storyMedia as image, index}
							<div
								class="dr-content-story-image-selection-item {$state.activeImage == index ? 'active' : ''}"
								on:click={() => setActiveImage(index)}
							>
								<img src="{$config.localMediaPath}{image.thumbnail}" alt={image.thumbnail} />
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
{#if $state.activeSecondary === false}
	<img id="instruction-story" src="{$config.localMediaPath}INSTRUCTION-STORY.png" alt="Choose a story" />
{/if}

<style>
	.dr-content-story-image-selection-item {
		border: solid 4px black;
		width: 180px;
		height: 180px;
		margin-right: 54px;
	}
	.dr-content-story-image-selection-item:last-child {
		margin-right: 0px;
	}
	#instruction-story {
		position: fixed;
		top: 300px;
		left: 1220px;
		width: auto;
		height: 420px;
	}
	.dr-content-stories {
		display: flex;
		flex-direction: row;
		height: 1320px;
	}
	.dr-content-story-text {
		width: calc(1180px-160px-2px);
		padding: 80px;
	}
	.dr-content-story-text-small-pad {
		width: calc(1180px-160px-2px);
		padding: 60px 80px;
	}
	.dr-content-story-title {
		font-family: var(--dr-body-font);
		font-weight: 400;
		font-size: 40px;
		margin-bottom: 20px;
	}
	.dr-content-story-title-small-margin {
		font-family: var(--dr-body-font);
		font-weight: 400;
		font-size: 40px;
		margin-bottom: 14px;
		margin-top: 10px;
	}
	:global(.dr-content-story-body) {
		font-family: var(--dr-body-font);
		font-weight: 400;
		font-size: 32px;
		line-height: 150%;
	}
	:global(.dr-content-story-body-small) {
		font-family: var(--dr-body-font);
		font-weight: 400;
		font-size: 30px;
		line-height: 150%;
	}
	:global(.dr-content-story-body-tiny) {
		font-family: var(--dr-body-font);
		font-weight: 400;
		font-size: 28px;
		line-height: 150%;
	}
	.dr-content-story-image {
		width: 1000px !important;
		height: 100%;
		align-self: flex-end;
		/* float: right; */
		border-left: solid 2px white;
		align-content: flex-start;
		display: flex;
		flex-flow: wrap column;
	}

	.dr-content-story-image-container {
		display: flex;
		width: 1000px;
		height: 1072px;
		align-self: flex-start;
		height: auto;
		border-bottom: solid 2px white;
	}

	.dr-content-story-image-container-nothumb {
		display: flex;
		width: 1000px;
		align-self: flex-start;
		height: 1320px;
	}

	.dr-content-story-image-caption {
		display: flex;
		position: absolute;
		align-self: flex-end;
		text-align: center;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.75);
		width: 984px;
		height: 106px;
		z-index: 9;
		padding-left: 8px;
		padding-right: 8px;
	}

	:global(.dr-content-story-image-caption p) {
		font-family: var(--dr-body-font);
		font-size: 24px;
	}
	.dr-content-story-image-container img {
		align-self: flex-start;
		width: 100%;
		height: 1078px;
		object-fit: cover;
	}
	.dr-content-story-image-container-nothumb img {
		align-self: flex-start;
		width: 100%;
		height: 1320px;
		object-fit: cover;
	}

	.dr-content-story-image-selections {
		align-self: flex-start;
		height: calc(100%-1072px);
		display: flex;
		width: 950px;
		flex-flow: wrap row;
		margin-top: 26px;
		margin-left: 40px;
	}

	.dr-content-story-image-selections img {
		width: 180px;
		height: 180px;
	}

	.dr-content-video-player {
		display: grid;
		width: 1000px;
		height: 1078px;
		grid-template-rows: 1fr 562px 1fr;
		border-bottom: solid 2px white;
	}

	video {
		width: 1000px !important;
		height: 562px;
		object-fit: contain;
		z-index: 0;
		grid-row-start: 2;
		grid-row-end: 3;
		background-color: black;
	}

	.dr-content-media-controls {
		display: flex;
		justify-content: flex-end;
		z-index: 2;
		grid-row-start: 3;
		grid-row-end: 4;
	}

	.dr-content-media-control-item {
		margin-right: 50px;
		margin-top: 50px;
		width: 220px;
		height: 60px;
		font-family: var(--dr-body-font);
		font-size: 24px;
		font-weight: normal;
		color: black;
		border-radius: 50px;
		background-color: #bfbfbf;
	}

	.dr-content-audio-controls {
		display: flex;
		justify-content: flex-start;
		z-index: 2;
	}

	.dr-content-audio-control-item {
		text-align: center;
		justify-content: center;
		align-items: center;
		padding-left: 40px;
		padding-right: 40px;
		margin-right: 50px;
		height: 60px;
		font-family: var(--dr-body-font);
		font-size: 24px !important;
		font-weight: normal;
		color: black;
		border-radius: 50px;
		background-color: #bfbfbf;
	}

	.dr-content-audio-control-item p {
		margin: 12px;
		font-size: 24px;
	}

	:global(.dr-content-media-control-item p) {
		align-self: center;
		margin: 0px;
	}
	.dr-content-media-caption {
		font-family: var(--dr-body-font);
		margin-left: 50px;
		margin-top: 0px;
		width: 100%;
		font-size: 24px;
		float: left;
		height: 60px;
		justify-content: center;
	}
</style>
