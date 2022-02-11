<script>
  import { state, config } from "./stores.js";

  function setActiveImage(value) {
    $state.activeImage = value;
    console.log($state);
  }
</script>

<div class="dr-content-stories">
  {#if $state.activeSecondary !== false}
    <div class="dr-content-story-text">
      <h2>{$state.activeObject.title}</h2>
      {@html $state.activeObject.body.replace(" – ", "&mdash;")}
    </div>
    <div class="dr-content-story-image">
      {#if $state.activeObject.hasOwnProperty("images")}
        <div class="dr-content-story-image-container">
          <img
            id="storyImage"
            src="{$config.mediaPath + $state.activeObject.images[$state.activeImage].full}"
            alt="Story"
          />
        </div>
        <div class="dr-content-story-image-caption">
          <p>{$state.activeObject.images[$state.activeImage].caption}</p>
        </div>
        <div class="dr-content-story-image-selections">
          {#each $state.activeObject.images as image, index}
            <div
              class="dr-content-story-image-selection-item {$state.activeImage ==
              index
                ? 'active'
                : ''}"
              on:click={() => setActiveImage(index)}
            >
              <img src="{$config.mediaPath + image.thumbnail}" alt={image.thumbnail} />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
{#if $state.activeSecondary === false}
  <img
    id="instruction-story"
    src="{$config.mediaPath}INSTRUCTION-STORY.png"
    alt="Choose a story"
  />
{/if}

<style>
  .dr-content-story-image-selection-item {
    border: solid 4px black;
    width: 180px;
    height: 180px;
    margin-right: 58px;
  }
  .dr-content-story-image-selection-item:nth-child(4n) {
    margin-right: 0px;
  }
  #instruction-story {
    position: fixed;
    top: 300px;
    left: 1220px;
    width: auto;
    height: 420px;
  }
  .dr-content-stories {
    display: flex;
    flex-direction: row;
    height: 1320px;
  }
  .dr-content-story-text {
    width: calc(1180px-160px-2px);
    padding: 80px;
  }
  .dr-content-story-text h2 {
    font-family: var(--dr-body-font);
    font-weight: 400;
    font-size: 40px;
    margin-bottom: 20px;
  }
  :global(.dr-content-story-text p) {
    font-family: var(--dr-body-font);
    font-weight: 400;
    font-size: 32px;
    line-height: 150%;
  }
  .dr-content-story-image {
    width: 1000px;
    height: 100%;
    align-self: flex-end;
    /* float: right; */
    border-left: solid 2px white;
    align-content: center;
    display: flex;
    flex-flow: wrap row;
    align-content: flex-start;
  }

  .dr-content-story-image-container {
    display: flex;
    align-self: flex-start;
    height: 1080px;
  }

  .dr-content-story-image-container img {
    align-self: flex-start;
    width: 1000px;
    height: 1078px;
    object-fit: cover;
    border-bottom: solid 2px white;
  }

  .dr-content-story-image-selections {
    align-self: flex-end;
    height: calc(100%-1072px);
    display: flex;
    width: 100%;
    flex-flow: wrap row;
    /* column-gap: 60px; */
    margin-top: 26px;
    margin-left: 40px;
  }

  .dr-content-story-image-selections img {
    width: 180px;
    height: 180px;
  }

  .dr-content-story-image-caption {
    position: absolute;
    display: flex;
    flex-flow: wrap row;
    align-content: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.75);
    width: 1000px;
    height: 106px;
    z-index: 9;
    top: 1010px;
  }

  .dr-content-story-image-caption p {
    font-family: var(--dr-body-font);
    font-size: 24px;
  }
</style>
