<script>
  import { state, config } from "./stores.js";
  import SvelteMarkdown from "svelte-markdown";
  import OSD from "./OSD.svelte";
</script>

<div class="dr-content-artifacts">
  {#if Object.keys($state.activeObject).length > 0}
    <div class="dr-content-artifact-text">
      <h2>{$state.activeObject.maker}</h2>
      <h2>{@html $state.activeObject.title}</h2>
      <h2>{$state.activeObject.date}</h2>
      <SvelteMarkdown source={$state.activeObject.description} />
      <p>{$state.activeObject.credit}</p>
    </div>
    <div class="dr-content-artifact-image">
      {#key $state.activeObject}
        <OSD />
      {/key}
    </div>
  {/if}
</div>
{#if Object.keys($state.activeObject).length == 0}
  <img
    id="instruction-artifact"
    src="{$config.imagesPath}INSTRUCTION-ARTIFACT.png"
    alt="Choose an artifact"
  />
{/if}

<style>
  #instruction-artifact {
    position: fixed;
    top: 300px;
    left: 1220px;
    width: auto;
    height: 420px;
  }
  .dr-content-artifacts {
    display: flex;
    flex-direction: row;
    height: 1320px;
  }

  .dr-content-artifact-text {
    width: calc(1180px-160px-2px);
    padding: 80px;
  }

  :global(.dr-content-artifacts h2) {
    font-family: var(--dr-body-font);
    font-weight: 500;
    font-size: 48px;
    margin: 0px;
  }

  :global(.dr-content-artifacts h2:last-of-type) {
    margin-bottom: 20px;
  }

  :global(.dr-content-artifacts p) {
    font-family: var(--dr-body-font);
    font-size: 36px;
  }

  :global(.dr-content-artifacts p:last-of-type) {
    font-family: var(--dr-body-font);
    font-style: italic;
    font-size: 36px;
  }

  .dr-content-artifact-image {
    width: 1000px;
    align-self: flex-end;
    /* float: right; */
    border-left: solid 2px;
    border-color: white;
    align-content: center;
  }

  /* .dr-content-artifact-image img {
    width: 1000px;
    height: 1316px;
    object-fit: cover;
  } */
</style>
