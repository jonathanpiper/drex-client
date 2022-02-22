<script>
  import { state, config } from "./stores.js";

  function setActiveObject(value) {
    $state.activeObject = value;
    $state.playPause = "Pause";
  }

  function toggleVideo() {
    video = document.getElementById("video");
    if (video.paused) {
      video.play();
      $state.playPause = "Pause";
    } else {
      video.pause();
      $state.playPause = "Play";
    }
  }
</script>

<div class="dr-content-media">
  {#if Object.keys($state.activeSecondary).length > 0}
    <div class="dr-content-media-header">
      <h2>{$state.activeSecondary.title}</h2>
    </div>
    {#if Object.keys($state.activeObject).length > 0}
      <video id="video" autoplay>
        <source src="{$config.mediaPath}{$state.activeObject.clip}" type="video/mp4" />
        <track src="" kind="captions" />
      </video>
      <div class="dr-content-media-overlay-{$state.activeSecondary.slug}">
        {#if $state.activeObject.person}
          <h2>{$state.activeObject.person}</h2>
        {/if}
        {#if $state.activeObject.title}
          <h2>“{$state.activeObject.title}”</h2>
        {/if}
        {#if $state.activeObject.instrument}
          <h2>{$state.activeObject.instrument}</h2>
        {/if}
        {#if $state.activeObject.credit}
          <h2>{$state.activeObject.credit}</h2>
        {/if}
        {#if $state.activeObject.caption}
          <h2>{$state.activeObject.caption}</h2>
        {:else if $state.activeObject.label}
          <h2>{$state.activeObject.label}</h2>
        {/if}
      </div>
      <div class="dr-content-media-controls">
        <div
          class="dr-content-media-control-item"
          on:click={() => setActiveObject(false)}
        >
          <p>Video Menu</p>
        </div>
        <div
          class="dr-content-media-control-item"
          on:click={() => toggleVideo()}
        >
          <p>{$state.playPause}</p>
        </div>
      </div>
    {:else}
      <div class="dr-content-media-list">
        {#each $state.activeSecondary.content as item}
          <div class="dr-content-media-wrapper">
            <div
              class="dr-content-media-item-{$state.activeSecondary.slug}"
              on:click={() => setActiveObject(item)}
            >
              <img
                src="{$config.mediaPath}{item.thumbnail}"
                alt={item.title || item.label}
              />
              {#if $state.activeSecondary.slug == "musicalmoments"}
                <h2>“{item.title}”</h2>
                <h2>{item.person}</h2>
              {:else if $state.activeSecondary.slug == "makingtheinstrument" || "voicesoftheindustry"}
                <h2>{item.label || item.summary}</h2>
              {/if}
            </div>
            {#if $state.activeSecondary.slug == "voicesoftheindustry"}<p>
                {item.summary}
              </p>{/if}
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
{#if $state.activeSecondary === false}
  <img
    id="instruction-media"
    src="{$config.mediaPath}INSTRUCTION-MEDIA.png"
    alt="Choose a category"
  />
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

  :global(.dr-content-media-header h2) {
    position: relative;
    font-family: var(--dr-body-font);
    font-weight: 600;
    font-size: 64px;
    margin: 0px;
    margin-bottom: 120px;
    z-index: 9;
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

  .dr-content-media-item-musicalmoments h2 {
    font-family: var(--dr-body-font);
    font-size: 24px;
    font-weight: normal;
    margin: 8px 20px;
  }

  div[class^="dr-content-media-item-"]:not(.dr-content-media-item-musicalmoments)
    h2 {
    font-family: var(--dr-body-font);
    font-size: 34px;
    font-weight: normal;
    margin: 20px 20px;
  }
  /* .dr-content-media-item-makingtheinstrument h2 {
    font-family: var(--dr-body-font);
    font-size: 36px;
    font-weight: normal;
    margin: 6px 20px;
  }
  .dr-content-media-item-voicesoftheindustry h2 {
    font-family: var(--dr-body-font);
    font-size: 36px;
    font-weight: normal;
    margin: 6px 20px;
  } */

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

  .dr-content-media-overlay-musicalmoments {
    position: absolute;
    width: 1200px;
    bottom: 220px;
    z-index: 9;
  }

  .dr-content-media-overlay-makingtheinstrument {
    position: absolute;
    width: 1200px;
    bottom: 90px;
    z-index: 9;
  }

  .dr-content-media-overlay-voicesoftheindustry {
    position: absolute;
    width: 1200px;
    bottom: 90px;
    z-index: 9;
  }

  .dr-content-media-overlay-voicesoftheindustry h2 {
    font-family: var(--dr-body-font);
    font-size: 48px;
    font-weight: normal;
    margin: 6px 0px;
  }

  .dr-content-media-overlay-makingtheinstrument h2 {
    font-family: var(--dr-body-font);
    font-size: 48px;
    font-weight: normal;
    margin: 6px 0px;
  }

  .dr-content-media-overlay-musicalmoments h2 {
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
</style>
