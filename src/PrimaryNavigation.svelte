<script>
  import { config, state } from "./stores.js";
  import { createEventDispatcher } from "svelte";
  export let rail;

  const dispatch = createEventDispatcher();

  function setPrimaryNavigation(value) {
    dispatch("resetState");
    $state.activePrimary = value;
  }
</script>

<div class="dr-primary-navigation-container">
  <div class="dr-primary-navigation-content">
    <div class="dr-primary-navigation-title" on:click={() => dispatch("resetState")}>
      <div id="dr-title">{rail.title}</div>
    </div>
    <div
      class="dr-primary-navigation-item {$state.activePrimary == 'stories'
        ? 'active'
        : ''}"
      on:click={() => setPrimaryNavigation("stories")}
    >
      <img src="{$config.mediaPath}stories.svg" alt="Stories" />
      <h2>Stories</h2>
    </div>
    <div
      class="dr-primary-navigation-item {$state.activePrimary == 'media'
        ? 'active'
        : ''}"
      on:click={() => setPrimaryNavigation("media")}
    >
      <img src="{$config.mediaPath}media.svg" alt="Watch+Learn" />
      <h2>Watch+Listen</h2>
    </div>
    <div
      class="dr-primary-navigation-item {$state.activePrimary == 'artifacts'
        ? 'active'
        : ''}"
      on:click={() => setPrimaryNavigation("artifacts")}
    >
      <img src="{$config.mediaPath}artifacts.svg" alt="Artifacts" />
      <h2>Artifacts</h2>
    </div>
  </div>
</div>
{#if $state.activePrimary === false}
  <img
    id="instruction-topic"
    src="{$config.mediaPath}INSTRUCTION-TOPIC.png"
    alt="Choose a topic"
  />
{/if}

<style>
  #instruction-topic {
    position: fixed;
    top: 970px;
    left: 160px;
    width: 250px;
    height: auto;
  }

  .dr-primary-navigation-container {
    background-color: rgba(255, 255, 255, 0.1);
    height: 900px;
    grid-column-start: primary-nav;
    grid-column-end: secondary-nav;
    border-bottom-right-radius: 40px;
    padding-left: 66px;
    padding-top: 62px;
  }

  .dr-primary-navigation-content {
    height: 775px;
    width: 500px;
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
</style>
