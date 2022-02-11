<script>
  import { fade } from "svelte/transition";
  import { state, config } from "./stores";
  export let dwellCount;
  export let rail;
</script>

<div
  class="dwell-screen"
  on:click={() => ($state.dwellScreenActive = false)}
  in:fade={{ duration: 2000 }}
  out:fade={{ duration: 500 }}
>
  <div class="dwell-bounding-box">
    <div class="dwell-text-banner bounce">
      <h2>TOUCH SCREEN TO BEGIN</h2>
    </div>
  </div>
  {#each rail.dwell.images as image, index}
    <img
      class="dwell-image {index == dwellCount ? 'visible' : 'hidden'}"
      src="{$config.mediaPath + image}"
      alt="Dwell screen"
    />
  {/each}
</div>

<style>
  .dwell-bounding-box {
    width: calc(100% - 400px);
    height: calc(100% - 200px);
    display: flex;
    /* flex-flow: row; */
    align-items: flex-end;
    justify-items: flex-end;
    margin: auto;
    z-index: 9999;
  }
  .dwell-text-banner {
    width: 1600px;
    display: flex;
    justify-content: center;
  }
  .bounce {
    animation: bounce 60s linear 100;
    transform-origin: 50% 80%;
    transform-box: view-box;
  }
  @keyframes bounce {
    0% {
      transform: translate(0%, 0%);
    }
    50% {
      transform: translate(1440px, 0%);
    }
    100% {
      transform: translate(0%, 0%);
    }
  }
  .dwell-screen {
    color: white;
    background-color: black;
    display: block;
    position: absolute;
    display: flex;
    align-content: flex-end;
    margin: 0px;
    width: 3440px;
    height: 1440px;
    z-index: 9999;
  }

  .dwell-screen h2 {
    font-family: var(--dr-body-font);
    font-size: 96pt;
    margin: 0;
  }

  :global(.visible) {
    visibility: visible;
    opacity: 1;
    transition: opacity 2s linear;
  }

  :global(.hidden) {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 2s, opacity 2s linear;
  }

  .dwell-screen img {
    position: absolute;
    top: 0;
    left: 0;
    object-fit: fill;
  }
</style>
