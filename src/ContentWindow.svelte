<script>
  //import VideoPlayer from "./VideoPlayer.svelte";
  import ContentMedia from "./ContentMedia.svelte";
  import ContentStories from "./ContentStories.svelte";
  import ContentArtifacts from "./ContentArtifacts.svelte";
  import { state } from "./stores.js";
  export let rail;
  // $: if ($state.activePrimary == "media" && $state.activeSecondary) {
  //   $state.activeMediaCategory = $state.activePrimary.content.filter(
  //     (obj) => {
  //       return obj.slug === $state.activeSecondary;
  //     }
  //   )[0];
  // }
  
</script>

<div class="dr-content-container" id="dr-content-container">
  {#if !$state.activePrimary}
    <div class="dr-content-home">
      <h2>{rail.title}</h2>
      {@html rail.body}
    </div>
  {:else if $state.activePrimary.contentType == "stories"}
    <ContentStories />
  {:else if $state.activePrimary.contentType == "media"}
    <ContentMedia />
  {:else if $state.activePrimary.contentType == "artifacts"}
    <ContentArtifacts />
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
    background-color: rgba(255, 255, 255, 0.1);
  }

  .dr-content-home {
    width: 100%;
    align-self: flex-start;
    padding: 220px 280px;
  }

  .dr-content-home h2 {
    margin: 0px;
    font-family: var(--dr-title-font);
    font-size: 96px;
    font-weight: bold;
    text-transform: uppercase;
  }

  :global(.dr-content-home p) {
    font-family: var(--dr-body-font);
    font-size: 48px;
  }

  :global(.dr-content-home p:first-of-type) {
    margin-top: 20px;
  }
</style>
