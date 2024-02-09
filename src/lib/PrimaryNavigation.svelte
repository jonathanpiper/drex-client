<script lang="ts">
	import { state } from "../store"
	import { onMount, createEventDispatcher } from "svelte"
	import { MEDIAPATH } from "../const"

	export let Rail

	var titleLongestWord = 0
	var titleNumberOfWords = 0

	const dispatch = createEventDispatcher()

	function setPrimaryNavigation(index: number) {
		dispatch("setPrimary", index)
	}

	function getTitleSize(string: string) {
		var words = string.split(" ")
		let numberOfWords: number = 0
		let longestWord: number = 0
		numberOfWords = words.length
		words.forEach((word) => {
			if (longestWord < word.length) {
				longestWord = word.length
			}
		})
		return [numberOfWords, longestWord]
	}

	onMount(async () => {
		;[titleLongestWord, titleNumberOfWords] = getTitleSize(Rail.title)
	})
</script>

<div class="dr-primary-navigation-container">
	<div class="dr-primary-navigation-content">
		{#if Rail.dateRange}
			<h1 class="dr-primary-navigation-dateRange">{Rail.dateRange}</h1>
		{/if}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="dr-primary-navigation-title" on:click={() => dispatch("resetState")}>
			<div
				id="dr-title{Rail.identifier == 'rail4a' || Rail.identifier.substring(4, 5) == '2'
					? '-small'
					: titleLongestWord > 8 || titleNumberOfWords > 3
						? '-mid'
						: ''}"
			>
				{Rail.title}
			</div>
		</div>
		{#each Rail.content as contentItem, index}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="dr-primary-navigation-item{getTitleSize(contentItem.title)[0] > 3 ? '-small' : ''} {$state.activePrimary == index ? 'active' : ''}"
				on:click={() => setPrimaryNavigation(index)}
			>
				<img
					src="{MEDIAPATH}{contentItem.icon ? contentItem.icon : contentItem.title.toLowerCase().replace(/\s/g, '') + '.svg'}"
					alt={contentItem.title}
				/>
				<h2>{contentItem.title}</h2>
			</div>
		{/each}
	</div>
	{#if $state.activePrimary === null}
		<img
			id="instruction-topic{Rail.content.length == 4 ? '-small' : ''}"
			src="{MEDIAPATH}INSTRUCTION-TOPIC{Rail.content.length == 4 ? '-SMALL' : ''}.png"
			alt="Choose a topic"
		/>
	{/if}
</div>

<style>
	.dr-primary-navigation-dateRange {
		color: var(--dr-gallery-color-dateRange);
		font-family: var(--dr-title-font);
		/* font-weight: 700; */
		font-size: 32pt;
		margin-bottom: 0px;
	}

	#instruction-topic {
		position: fixed;
		top: 950px;
		left: 160px;
		width: 250px;
		height: auto;
	}

	/* #instruction-topic {
		position: relative;
        display: inline-block;
		top: 950px;
		left: 160px;
		width: 250px;
		height: auto;
	} */

	#instruction-topic-small {
		position: fixed;
		top: 1120px;
		left: 160px;
		width: 250px;
		height: auto;
	}

	.dr-primary-navigation-container {
		background-color: rgba(255, 255, 255, 0.1);
		grid-column-start: primary-nav;
		grid-column-end: secondary-nav;
		border-bottom-right-radius: 40px;
		padding-left: 66px;
		padding-top: 62px;
		margin-bottom: auto;
	}

	.dr-primary-navigation-content {
		width: 500px;
		margin-bottom: 20px;
		padding-bottom: 4px;
	}

	.dr-primary-navigation-title {
		height: 300px;
		display: flex;
		border-bottom: 1px solid;
		border-color: white;
		margin-bottom: 60px;
	}

	.dr-primary-navigation-title #dr-title {
		align-self: flex-end;
		font-family: var(--dr-title-font);
		font-size: 72pt;
		font-weight: bold;
		text-transform: uppercase;
		line-height: 1.05;
		margin-bottom: 35px;
	}

	.dr-primary-navigation-title #dr-title-small {
		align-self: flex-end;
		font-family: var(--dr-title-font);
		font-size: 48pt;
		font-weight: bold;
		text-transform: uppercase;
		line-height: 1.05;
		margin-bottom: 35px;
	}

	.dr-primary-navigation-title #dr-title-mid {
		align-self: flex-end;
		font-family: var(--dr-title-font);
		font-size: 54pt;
		font-weight: bold;
		text-transform: uppercase;
		line-height: 1.05;
		margin-bottom: 35px;
	}

	.dr-primary-navigation-item {
		display: flex;
		align-items: center;
		height: 130px;
		width: 1fr;
		border-radius: 10px;
		border: solid 4px black;
		background-color: var(--dr-gallery-color);
		padding-left: 25px;
		margin-bottom: 40px;
	}

	.dr-primary-navigation-item img {
		height: 60px;
		margin-right: 25px;
	}

	.dr-primary-navigation-item h2 {
		align-self: center;
		font-family: var(--dr-body-font);
		font-size: 48px;
		font-weight: normal;
		text-transform: uppercase;
	}
	.dr-primary-navigation-item-small h2 {
		align-self: center;
		font-family: var(--dr-body-font);
		font-size: 40px;
		font-weight: normal;
		text-transform: uppercase;
	}
	.dr-primary-navigation-item-small {
		display: flex;
		align-items: center;
		height: 130px;
		width: 1fr;
		border-radius: 10px;
		border: solid 4px black;
		background-color: var(--dr-gallery-color);
		padding-left: 25px;
		margin-bottom: 40px;
	}
</style>
