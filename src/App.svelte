<script>
	import PrimaryNavigation from './PrimaryNavigation.svelte';
	import SecondaryNavigation from './SecondaryNavigation.svelte';
	import ContentWindow from './ContentWindow.svelte';
	import DwellScreen from './DwellScreen.svelte';
	import { state, apiurl, config } from './stores.js';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	const webSocket = new WebSocket('ws://192.168.168.180:9000');
	webSocket.onmessage = (event) => {
		const wsMessage = event.data.replace(/["]/g, '');
		console.log(wsMessage);
		if (wsMessage == 'forceRefresh') {
			console.log('Received reload message from DREX server.');
			window.location.reload();
		} else {
			console.log(`Unrecognized message from DREX server: ${wsMessage}`);
		}
	};

	var url = window.location.href;
	const railName = url.split('?')[1];

	async function getRailContent() {
		console.log('getrail');
		var req, res, content, response;
		try {
			req = await fetch('./mediapool/rail.json')
			res = await req.text();
			content = JSON.parse(res);
		} catch (err) {
			console.log(err);
		}
		if (content) {
			return content;
		} else {
			console.log('cannot read json');
		}
	}

	async function getRailConfig() {
		let response = await fetch($apiurl + '/drex/config');
		var configPromise = await response.json();
		return configPromise;
	}

	var mediaFiles = [];

	function getMediaFiles(content) {
		var filename;
		content.dwell.images.forEach((image) => {
			mediaFiles.push($config.imagesPath + image);
		});
		content.content.forEach((category) => {
			if (category.contentType == 'stories') {
				category.content.forEach((story) => {
					mediaFiles.push($config.imagesPath + story.heroImage);
					story.images.forEach((image) => {
						mediaFiles.push($config.imagesPath + image.full);
						if (image.thumbnail) {
							mediaFiles.push($config.imagesPath + image.thumbnail);
						}
					});
				});
			} else if (category.contentType == 'artifacts') {
				category.content.forEach((artifact) => {
					artifact.images.forEach((image) => {
						filename = artifact.objectID + '_' + image.name + '.jpg';
						mediaFiles.push($config.objectImagesPath + filename);
						image.altsizes.forEach((size) => {
							filename = artifact.objectID + '_' + image.name + size + '.jpg';
							mediaFiles.push($config.objectImagesPath + filename);
						});
					});
				});
			} else if (category.contentType == 'media') {
				category.content.forEach((section) => {
					mediaFiles.push($config.imagesPath + section.heroImage);
					section.content.forEach((clip) => {
						mediaFiles.push($config.imagesPath + clip.thumbnail);
					});
				});
			}
		});
		mediaFiles.forEach((image) => {
			try {
				var img = new Image();
				img.src = image;
			} catch (err) {
				console.log(err);
			}
		});
		return mediaFiles;
	}

	function setRailStyles(configObject) {
		var bS = document.body.style;
		var gallery = 'gallery' + railName.substring(0, 1);
		bS.setProperty('--dr-title-font', configObject['dr-title-font']);
		bS.setProperty('--dr-body-font', configObject['dr-body-font']);
		bS.setProperty('--dr-gallery-color', configObject['dr-gallery-colors'][gallery].color);
		bS.setProperty('--dr-gallery-color-active', configObject['dr-gallery-colors'][gallery].activeColor);
		if (configObject['dr-gallery-colors'][gallery].hasOwnProperty('dateRangeColor')) {
			bS.setProperty('--dr-gallery-color-dateRange', configObject['dr-gallery-colors'][gallery].dateRangeColor);
		}
	}

	getRailConfig().then((result) => setRailStyles(result));

	let promise = getRailContent();
	//.then(idleTimer);

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
		($state.playPause = 'Play'), ($state.playPauseAudio = 'Play');
	}

	var dwellCount = 0;

	function idleTimer() {
		console.log('Initializing timer.');
		var t;
		window.onload = resetTimer;
		//window.onmousemove = resetTimer; // catches mouse movements
		window.onmousedown = resetTimer; // catches mouse movements
		window.onclick = resetTimer; // catches mouse clicks
		window.onscroll = resetTimer; // catches scrolling
		window.onkeypress = resetTimer; //catches keyboard actions

		function setDwellScreen() {
			if ($state.playPause == 'Play') {
				$state.dwellScreenActive = true;
				rotateDwellImage();
				setTimeout(resetState, 2000);
			} else {
				resetTimer();
			}
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
			clearTimeout(t);
			t = setTimeout(setDwellScreen, DWELLTIMEOUT * 1000);
		}
		resetTimer();
	}

	onMount(async () => {
		idleTimer();
	});
</script>

<svelte:head>
	<title>Museum of Making Music Digital Rail {railName}</title>
</svelte:head>
{#await promise}
	<div class="loading-container"><h1>Now loading Museum of Making Music Digital Rail {railName}</h1></div>
{:then rail}
	{#if $state.dwellScreenActive}
		<DwellScreen {dwellCount} {rail} />
	{/if}
	<div id="digital-rail" class="dr-container" transition:fade>
		<PrimaryNavigation {rail} on:resetState={resetState} />
		<SecondaryNavigation on:resetState={resetState} />
		<ContentWindow {rail} on:resetState={resetState} />
	</div>
{:catch}
	Connection disrupted!
{/await}

<style>
	.loading-container {
		position: absolute;
		width: 1000px;
		margin: -500px 0 0 -500px;
		color: white;
		top: 50%;
		left: 50%;
		font-family: var(--dr-title-font);
	}

	:global(:root) {
		--dr-title-font: '';
		--dr-body-font: '';
		--dr-gallery-color: '';
		--dr-gallery-color-active: '';
		--dr-gallery-color-dateRange: '';
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
		cursor: none!important;
	}

	:global(*) {
		cursor: none!important;
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
		font-family: 'Montserrat';
		src: url('/mediapool/Montserrat-VariableFont_wght.ttf') format('truetype');
	}

	@font-face {
		font-family: 'Signika';
		src: url('/mediapool/Signika-VariableFont_wght.ttf') format('truetype');
	}

	@font-face {
		font-family: 'OpenSans';
		src: url('/mediapool/OpenSans-VariableFont_wdthwght.ttf') format('truetype');
	}
</style>
