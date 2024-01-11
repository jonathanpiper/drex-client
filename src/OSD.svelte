<script>
	import OpenSeadragon from "openseadragon"
	import { onMount } from "svelte"
	import { config, state } from "./stores.js"
	var viewer

	onMount(() => {
		createOSDViewer()
		updateOSDViewerImages($state.activeObject, viewer)
	})

	function createOSDViewer() {
		viewer = OpenSeadragon({
			id: "openseadragon1",
			prefixUrl: "/mediapool/",
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
		})
	}

	function updateOSDViewerImages(object, viewer) {
		viewer.tileSources = []
		object.artifactImages.forEach((img) => {
            const filename = img.image.substring(0, img.image.length - 4)
			var levelsArray = []
			;["_quarter", "_half", "_threequarter"].forEach((size) => {
				var multiplier = size == "_quarter" ? 0.25 : size == "_half" ? 0.5 : 0.75
				levelsArray.push({
					url: $config.localMediaPath + filename + size + ".jpg",
					width: Math.floor(img.width * multiplier),
					height: Math.floor(img.height * multiplier),
				})
			})
			levelsArray.push({
				url: $config.localMediaPath + filename + ".jpg",
				width: img.width,
				height: img.height,
			})
			viewer.tileSources.push({
				type: "legacy-image-pyramid",
				levels: levelsArray,
			})
		})
		viewer.viewport.minZoomlevel = viewer.viewport.getHomeZoom()
		viewer.goToPage(0)
	}
</script>

<div class="OSDparent">
	<div id="openseadragon1" style="width: 1000px; height: 1320px; background-color: black;" />
	<div id="OSDToolbar" class="toolbar">
		<div class="left">
			<div id="zoom-out" href="#zoom-out">
				<img src="{$config.localMediaPath}zoomout.svg" alt="Zoom out" />
			</div>
			<div id="zoom-in" href="#zoom-in">
				<img src="{$config.localMediaPath}zoomin.svg" alt="Zoom in" />
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
				<img src="{$config.localMediaPath}previous.svg" alt="Previous" />
			</div>
			<div id="next" href="#next">
				<img src="{$config.localMediaPath}next.svg" alt="Next" />
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
