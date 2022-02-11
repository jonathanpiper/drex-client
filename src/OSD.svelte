<script>
  import OpenSeadragon from "openseadragon";
  import { onMount } from "svelte";
  import { config, state } from "./stores.js";
  var viewer;

  onMount(() => {
    createOSDViewer();
    updateOSDViewerImages($state.activeObject, viewer);
  });

  function createOSDViewer() {
    viewer = OpenSeadragon({
      id: "openseadragon1",
      prefixUrl: "/OSDimages/",
      sequenceMode: true,
      tileSources: [],
      navigatorAutoResize: false,
      minZoomImageRatio: 1,
      maxZoomPixelRatio: 3,
      animationTime: 0.2,
      springStiffness: 2,
      constrainDuringPan: true,
      visibilityRatio: 1,
      minZoomLevel: null,
      autoHideControls: false,
      showFullPageControl: false,
      dblClickToZoom: false,
      clickTimeThreshold: 500,
      toolbar: "OSDToolbar",
      zoomInButton: "zoom-in",
      zoomOutButton: "zoom-out",
      // homeButton: "home",
      previousButton: "previous",
      nextButton: "next",
      showHomeControl: false,
    });
  }

  function updateOSDViewerImages(object, viewer) {
    viewer.tileSources = [];
    object.images.forEach((img) => {
      var levelsArray = [];
      img.altsizes.forEach((size) => {
        var multiplier =
          size == "_quarter" ? 0.25 : size == "_half" ? 0.5 : 0.75;
        //console.log(size, multiplier);
        levelsArray.push({
          url:
            $config.objectImagesPath +
            object.objectID +
            "_" +
            img.name +
            size +
            ".jpg",
          width: img.width * multiplier,
          height: img.height * multiplier,
        });
      });
      levelsArray.push({
        url:
          $config.objectImagesPath + object.objectID + "_" + img.name + ".jpg",
        width: img.width,
        height: img.height,
      });
      viewer.tileSources.push({
        type: "legacy-image-pyramid",
        levels: levelsArray,
      });
    });
    viewer.viewport.minZoomlevel = viewer.viewport.getHomeZoom();
    viewer.goToPage(0);
  }
</script>

<div class="OSDparent">
  <div
    id="openseadragon1"
    style="width: 1000px; height: 1320px; background-color: black;"
  />
  <div id="OSDToolbar" class="toolbar">
    <div class="left">
      <div id="zoom-out" href="#zoom-out">
        <img src="{$config.OSDImagesPath}zoomout.svg" alt="Zoom out" />
      </div>
      <div id="zoom-in" href="#zoom-in">
        <img src="{$config.OSDImagesPath}zoomin.svg" alt="Zoom in" />
      </div>
      <!-- <img
        id="home"
        href="#home"
        src="./media/OSDimages/fa-home.png"
        alt="Home"
      /> -->
    </div>
    <div class="right">
      <div id="previous" href="#previous">
        <img src="{$config.OSDImagesPath}previous.svg" alt="Previous" />
      </div>
      <div id="next" href="#next">
        <img src="{$config.OSDImagesPath}next.svg" alt="Next" />
      </div>
    </div>
  </div>
</div>

<style>
  .OSDparent {
    display: grid;
    grid-template-rows: 1200px 120px;
    height: 1320px;
  }
  #openseadragon1 {
    grid-row-start: span 1;
  }
  .toolbar {
    grid-row-start: 2;
    z-index: 10;
    margin-bottom: 10px;
    align-items: center;
    /* display: flex; */
  }
  .left {
    float: left;
    margin-left: 10px;
  }
  .right {
    float: right;
    margin-right: 10px;
  }
  .left img {
    padding: 0px 20px 10px;
  }
  .right img {
    padding: 0px 20px 10px;
  }
  img {
    width: auto;
    height: 100px;
  }
</style>
