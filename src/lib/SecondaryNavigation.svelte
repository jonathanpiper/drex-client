<script lang="ts">
	import { state, MEDIAPATH } from "../store.js"
	import { SUBSTITUTIONS } from "../const.js"
	import { createEventDispatcher } from "svelte"
	export let Category

	const dispatch = createEventDispatcher()

	const setSecondaryNavigation = (index: number) => {
		dispatch("setSecondary", index)
		$state.activeImage = 0
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
		return string.length
	}
</script>

<div class="dr-secondary-navigation-container">
	{#if Category}
		<div class="dr-secondary-navigation-header">
			<div class="flex-item">
				<img src="{$MEDIAPATH}{Category.icon ? Category.icon : Category.toLowerCase().replace(/\s/g, '') + '.svg'}" alt="Icon" />
			</div>
			<div class="break" />
			<div class="flex-item">
				<h2 class={Category.title.length > 12 ? "dr-secondary-navigation-header-small" : ""}>
					{Category.title}
				</h2>
			</div>
		</div>
		{#if Category._type !== "artifacts"}
			<div class="dr-secondary-navigation-items">
				{#each Category.items as item, index}
					{#if item}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="dr-secondary-navigation-item{getTitleSize(item.title) > 20 ? '-small' : ''} {$state.activeSecondary == index
								? 'active'
								: ''}"
							on:click={() => setSecondaryNavigation(index)}
						>
							<img src="{$MEDIAPATH}{item.heroImage}" alt={item.title} style="object-position: top" />
							<h2>
								{#if SUBSTITUTIONS.hasOwnProperty(item._type)}
									{SUBSTITUTIONS[item._type]}
								{:else}
									{item.title}
								{/if}
							</h2>
						</div>
					{/if}
				{/each}
			</div>
		{:else}
			<div class="dr-secondary-navigation-artifacts-list{Category.items.length > 18 ? '-small' : ''}">
				{#each Category.items as artifact, index}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="dr-secondary-navigation-artifact{Category.items.length > 18 ? '-small' : ''} {$state.activeSecondary === index ? 'active' : ''}"
						on:click={() => setSecondaryNavigation(index)}
					>
						{index + 1}
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	.dr-secondary-navigation-container {
		grid-column-start: secondary-nav;
		grid-column-end: content;
		margin-top: 58px;
		margin-bottom: 58px;
		/* border: solid 2px;
    border-color: white; */
		height: 1320px;
	}

	.dr-secondary-navigation-header {
		display: flex;
		flex-flow: row wrap;
		text-align: center;
		justify-content: center;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	/* .dr-secondary-navigation-header hr {
    flex-basis: 100%;
    height: 0;
    border: 0;
    margin: 0;
  } */

	.flex-item {
		flex-grow: 1;
		align-content: center;
		margin: 0 auto;
	}

	.break {
		flex-basis: 100%;
		height: 0;
	}

	.dr-secondary-navigation-header h2 {
		align-self: center;
		font-family: var(--dr-body-font);
		font-size: 70px;
		font-weight: 400;
		text-transform: uppercase;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.dr-secondary-navigation-header-small {
		font-size: 44px !important;
		text-align: center;
	}

	.dr-secondary-navigation-header img {
		width: 139px;
		break-after: always;
	}

	div[class^="dr-secondary-navigation-item"] {
		border: solid 4px black;
		background-color: var(--dr-gallery-color);
		height: 325px;
		margin-bottom: 30px;
	}

	.dr-secondary-navigation-item h2 {
		font-family: var(--dr-body-font);
		font-size: 36px;
		font-weight: normal;
		margin: 8px 16px;
	}

	.dr-secondary-navigation-item-small h2 {
		font-family: var(--dr-body-font);
		font-size: 30px;
		font-weight: normal;
		margin: 12px 16px;
	}

	div[class^="dr-secondary-navigation-item"] img {
		width: 100%;
		height: 250px;
		object-fit: cover;
		object-position: right bottom;
	}

	.dr-secondary-navigation-artifacts-list {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		column-gap: 28px;
		row-gap: 26px;
		/* display: flex;
		flex-flow: row wrap; */
		/* row-gap: 28px;
    column-gap: 28px; */
	}

	.dr-secondary-navigation-artifacts-list-small {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		column-gap: 22px;
		row-gap: 22px;
	}

	.dr-secondary-navigation-artifact {
		line-height: 148px;
		background-color: var(--dr-gallery-color);
		font-family: var(--dr-body-font);
		font-size: 64px;
		text-align: center;
		border: solid 4px black;
		/* margin-right: 28px;
		margin-bottom: 26px; */
		/* width: 148px; */
		/* height: 148px; */
	}

	.dr-secondary-navigation-artifact-small {
		line-height: 110px;
		background-color: var(--dr-gallery-color);
		font-family: var(--dr-body-font);
		font-size: 64px;
		text-align: center;
		border: solid 4px black;
		/* margin-right: 28px;
		margin-bottom: 26px; */
		/* width: 148px; */
		/* height: 148px; */
	}

	/* .dr-secondary-navigation-artifact:nth-child(3n) {
		margin-right: 0px;
	} */
</style>
