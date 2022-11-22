<script>
	import { config, state, substitutions } from './stores.js';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function setActiveObject(object) {
		if ($state.activePrimary.contentType == 'media') {
			if (object.contentType == 'custom') {
				$state.activeSecondary = object;
				$state.activeObject = object;
			} else {
				$state.activeSecondary = object;
				$state.activeObject = {}
			}
		} else {
			$state.activeSecondary = {};
			$state.activeObject = object;
		}
		// $state.activePrimary.contentType == 'media' && object.contentType != 'custom' ? ($state.activeSecondary = object) : ($state.activeSecondary = {});
		// $state.activePrimary.contentType == 'media' && object.contentType != 'custom' ? ($state.activeObject = {}) : ($state.activeObject = object);
		$state.activeImage = 0;
		$state.playPause = 'Play';
		console.log($state.activeObject);
	}
</script>

<div class="dr-secondary-navigation-container">
	{#if $state.activePrimary}
		<div class="dr-secondary-navigation-header">
			<div class="flex-item">
				<img src="{$config.iconsPath}{$state.activePrimary.icon ? $state.activePrimary.icon : $state.activePrimary.title.toLowerCase().replace(/\s/g, '') + '.svg'}" alt="Icon" />
			</div>
			<div class="break" />
			<div class="flex-item">
				<h2 class={$state.activePrimary.title.length > 12 ? 'dr-secondary-navigation-header-small' : ''}>
					{$state.activePrimary.title}
				</h2>
			</div>
		</div>
		{#if $state.activePrimary.contentType != 'artifacts'}
			<div class="dr-secondary-navigation-items">
				{#each $state.activePrimary.content as item}
					<div
						class="dr-secondary-navigation-item {$state.activeObject == item || $state.activeSecondary == item ? 'active' : ''}"
						on:click={() => setActiveObject($state.activePrimary.contentType == 'custom' ? item.content[0] : item)}
					>
						<img src="{$config.imagesPath}{item.heroImage}" alt={item.title} style="object-position: top" />
						<h2>
							{#if $substitutions.has(item.contentType)}
								{$substitutions.get(item.contentType)}
							{:else}
								{item.title}
							{/if}
						</h2>
					</div>
				{/each}
			</div>
		{:else}
			<div class="dr-secondary-navigation-artifacts-list{$state.activePrimary.content.length > 18 ? '-small' : ''}">
				{#each $state.activePrimary.content as artifact, index}
					<div
						class="dr-secondary-navigation-artifact{$state.activePrimary.content.length > 18 ? '-small' : ''} {$state.activeObject === artifact ? 'active' : ''}"
						on:click={() => setActiveObject(artifact)}
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

	.dr-secondary-navigation-item {
		border: solid 4px black;
		background-color: var(--dr-gallery-color);
		height: 325px;
		margin-bottom: 30px;
	}

	.dr-secondary-navigation-item h2 {
		font-family: var(--dr-body-font);
		font-size: 36px;
		font-weight: normal;
		margin: 12px 20px;
	}

	.dr-secondary-navigation-item img {
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
