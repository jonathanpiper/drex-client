<script>
	import { config, state } from "./stores.js";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	// function setSecondaryNavigation(value) {
	//   $state.activeSecondary = value;
	// }

	// function setActiveMediaCategory(value) {
	//   setSecondaryNavigation(value);
	//   $state.activeObject = {};
	// }

	function setActiveObject(object) {
		$state.activePrimary.contentType == "media"
			? ($state.activeSecondary = object)
			: ($state.activeSecondary = {});
		$state.activePrimary.contentType != "media"
			? ($state.activeObject = object)
			: ($state.activeObject = {});
		$state.activeImage = 0;
		$state.playPause = "Pause";
	}

	// function setActiveStory(value) {
	//   $state.activeSecondary = "stories";
	//   $state.activeImage = 0;
	//   setActiveObject(value);
	// }
</script>

<div class="dr-secondary-navigation-container">
	<!-- <div class="dr-secondary-navigation-home" /> -->
	<!-- <div class="dr-secondary-navigation-stories"> -->
	{#if $state.activePrimary}
		<div class="dr-secondary-navigation-header">
			<div class="flex-item">
				<img
					src="{$config.mediaPath}{$state.activePrimary.slug}.svg"
					alt={$state.activePrimary.name}
				/>
			</div>
			<div class="break" />
			<div class="flex-item">
				<h2
					class={$state.activePrimary.name.length > 12
						? "dr-secondary-navigation-header-small"
						: ""}
				>
					{$state.activePrimary.name}
				</h2>
			</div>
		</div>
		{#if $state.activePrimary.slug != "artifacts"}
			<div class="dr-secondary-navigation-items">
				{#each $state.activePrimary.content as item}
					<div
						class="dr-secondary-navigation-item {$state.activeObject ==
						item || $state.activeSecondary == item
							? 'active'
							: ''}"
						on:click={() => setActiveObject(item)}
					>
						<img
							src="{$config.mediaPath}{item.thumbnail}"
							alt={item.title}
						/>
						<h2>{item.title}</h2>
					</div>
				{/each}
			</div>
			<!-- {:else if $state.activePrimary == "media"}
      <div class="dr-secondary-navigation-items">
        {#each rail[$state.activePrimary].categories as category}
          <div
            class="dr-secondary-navigation-item {$state.activeSecondary == category.slug ? "active" : ""}"
            on:click={() => setActiveMediaCategory(category.slug)}
          >
            <img src="{$config.mediaPath + category.thumbnail}" alt={category.title} />
            <h2>{category.title}</h2>
          </div>
        {/each}
      </div>.-->
		{:else}
			<div class="dr-secondary-navigation-artifacts-list">
				{#each $state.activePrimary.content as artifact, index}
					<div
						class="dr-secondary-navigation-artifact {$state.activeObject ===
						artifact
							? 'active'
							: ''}"
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
		font-size: 48px !important;
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
		display: flex;
		flex-flow: row wrap;
		/* row-gap: 28px;
    column-gap: 28px; */
	}

	.dr-secondary-navigation-artifact {
		width: 148px;
		height: 148px;
		line-height: 154px;
		background-color: var(--dr-gallery-color);
		font-family: var(--dr-body-font);
		font-size: 64px;
		text-align: center;
		border: solid 4px black;
		margin-right: 28px;
		margin-bottom: 26px;
	}

	.dr-secondary-navigation-artifact:nth-child(3n) {
		margin-right: 0px;
	}
</style>
