<script lang="ts">
	import { onMount } from "svelte"
	import ContentMedia from "./ContentMedia.svelte"
	import ContentStories from "./ContentStories.svelte"
	  import ContentArtifacts from "./ContentArtifacts.svelte";
	// import SvelteMarkdown from "svelte-markdown"
	import { marked } from "marked"
	import { state } from "../store"
	// export let Item
	export let HomeScreen: { title: string; body: string }
	export let Content
	export let Type
	// export let Rail
	var longestWord: number = 0
	var numberOfWords: number = 0

	onMount(async () => {
		getTitleSize(HomeScreen.title)
	})

	function getTitleSize(string) {
		var words = string.split(" ")
		numberOfWords = words.length
		words.forEach((word) => {
			if (longestWord < word.length) {
				longestWord = word.length
			}
		})
	}
</script>

<div class="dr-content-container" id="dr-content-container">
	{#if $state.activePrimary === null}
		<div class="dr-content-home">
			<h2 class="dr-content-home-title{longestWord > 8 || numberOfWords > 3 ? '-mid' : ''}">{HomeScreen.title}</h2>
			<div class="dr-content-home-body">
				{@html marked.parse(HomeScreen.body)}
			</div>
		</div>
	{:else}
		{#if Type === "stories"}
			<ContentStories {Content} />
		{:else if Type === "media"}
			<ContentMedia {Content} />
		{:else if Type === "artifacts"}
			<ContentArtifacts {Content}/>
		{/if}
	{/if}
</div>

<style>
	.dr-content-container {
		border: solid 2px;
		border-color: white;
		grid-column-start: content;
		grid-column-end: end;
		display: flex;
		align-items: flex-start;
		width: 100%;
		height: 1320px;
		margin-top: 58px;
		margin-bottom: 58px;
		background-color: rgba(255, 255, 255, 0.0);
	}

	.dr-content-home {
		width: 100%;
		align-self: flex-start;
        margin: auto 200px;
		/* padding: 220px 280px; */
	}

	.dr-content-home-title {
		margin: 0px;
		font-family: var(--dr-title-font);
		font-size: 96px;
		font-weight: bold;
		text-transform: uppercase;
	}

	.dr-content-home-title-mid {
		margin: 0px;
		font-family: var(--dr-title-font);
		font-size: 90px;
		font-weight: bold;
		text-transform: uppercase;
	}

	:global(.dr-content-home-body) {
		font-family: var(--dr-body-font);
		font-size: 48px;
	}

	:global(.dr-content-home p:first-of-type) {
		margin-top: 20px;
	}
</style>
