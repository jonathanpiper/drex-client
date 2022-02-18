<script>
  import PrimaryNavigation from "./PrimaryNavigation.svelte";
  import SecondaryNavigation from "./SecondaryNavigation.svelte";
  import ContentWindow from "./ContentWindow.svelte";
  import DwellScreen from "./DwellScreen.svelte";
  import { state, config } from "./stores.js";
  import { fade } from "svelte/transition";

  async function getRailContent() {
    let response = await fetch(
      "http://192.168.168.180:4000/drex/railRAIL_TARGET"
    );
    promise = await response.json();
  }

  async function getRailConfig() {
    let response = await fetch(
      "http://192.168.168.180:4000/drex/config"
    );
    var configPromise = await response.json();
    return configPromise;
  }

  function setRailStyles(configObject) {
    var bS = document.body.style;
    var gallery = "gallery" + "RAIL_TARGET".substring(0,1);
    bS.setProperty('--dr-title-font', configObject['dr-title-font']);
    bS.setProperty('--dr-body-font', configObject['dr-body-font']);
    bS.setProperty('--dr-gallery-color', configObject['dr-gallery-colors'][gallery].color);
    bS.setProperty('--dr-gallery-color-active', configObject['dr-gallery-colors'][gallery].activeColor);
  }

  var promise = getRailContent().then(value => {console.log('loaded', value)}).then(idleTimer);

  getRailConfig().then(result => setRailStyles(result));

  //Dwell screen timeout in seconds.
  const DWELLTIMEOUT = 120;

  //Dwell screen image rotation in seconds.
  const DWELLROTATE = 10;

  function resetState() {
    $state.activePrimary = false;
    $state.activeSecondary = false;
    $state.activeTertiary = false;
    $state.activeImage = 0;
    $state.activeObject = {};
    $state.activeMediaCategory = {};
  }

  var dwellCount = 0;

  function idleTimer() {
    var t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer; // catches mouse movements
    window.onmousedown = resetTimer; // catches mouse movements
    window.onclick = resetTimer; // catches mouse clicks
    window.onscroll = resetTimer; // catches scrolling
    window.onkeypress = resetTimer; //catches keyboard actions

    function setDwellScreen() {
      $state.dwellScreenActive = true;
      console.log('dwell');
      rotateDwellImage();
      setTimeout(resetState, 2000);
    }

    function rotateDwellImage() {
      clearTimeout(t);
      t = setTimeout(incrementDwellCount, DWELLROTATE * 1000);
    }

    function incrementDwellCount() {
      if (dwellCount == 2) {
        dwellCount = 0;
      } else {
        dwellCount = dwellCount + 1;
      }
      rotateDwellImage();
    }

    function resetTimer() {
      console.log('dwell timeout started');
      clearTimeout(t);
      t = setTimeout(setDwellScreen, DWELLTIMEOUT * 1000);
    }
    resetTimer();
  }

  //console.log(rail);

  //idleTimer();
  const sse = new EventSource('http://192.168.168.180:4000/drex/subscribe');
  sse.addEventListener("notice", function(e) {
    console.log(e.data)
  })

</script>

<svelte:head>
  <title>Museum of Making Music Digital Rail RAIL_TARGET</title>
  {#each MEDIA_FILES as item}
    {#if item.substr(-3) == "jpg" || item.substr(-3) == "svg"}
      <link rel="preload" as="image" href={$config.mediaPath + item} />
    {:else if item.substr(-3) == "mp4"}
      <link rel="preload" as="video" href={$config.mediaPath + item} />
    {/if}
  {/each}
</svelte:head>
{#await promise}
loading!
{:then rail}
  {#if $state.dwellScreenActive}
    <DwellScreen {dwellCount} {rail} />
  {/if}
  <div class="dr-container" transition:fade>
    <PrimaryNavigation {rail} on:resetState={resetState} />
    <SecondaryNavigation on:resetState={resetState} />
    <ContentWindow {rail} on:resetState={resetState} />
  </div>
  {:catch}
  Connection disrupted!
{/await}


<style>
  :global(:root) {
    --dr-title-font: "";
    --dr-body-font: "";
    --dr-gallery-color: "";
    --dr-gallery-color-active: "";
  }

  :global(.active) {
    border: solid 4px white !important;
    background-color: var(--dr-gallery-color-active) !important;
  }

  :global(img) {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  :global(html) {
    background-color: black;
  }

  .dr-container {
    margin: 0px;
    width: 3440px;
    height: 1440px;
    background-color: black;
    display: grid;
    grid-template-columns: [primary-nav] 620px [secondary-nav] 525px [content] 2120px [end];
    grid-column-gap: 55px;
    color: white;
    z-index: -99;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  @font-face {
    font-family: "Montserrat";
    src: url(../fonts/Montserrat-VariableFont_wght.ttf) format("truetype");
  }

  @font-face {
    font-family: "Signika";
    src: url(../fonts/Signika-VariableFont_wght.ttf) format("truetype");
  }

  @font-face {
    font-family: "OpenSans";
    src: url(../fonts/OpenSans-VariableFont_wdthwght.ttf) format("truetype");
  }
</style>
