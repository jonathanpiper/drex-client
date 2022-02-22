import { writable } from 'svelte/store';

async function getRailContent() {
    let response = await fetch(
      "http://192.168.168.180:4000/drex/railRAIL_TARGET"
    );
    promise = await response.json();
  }

export const rail = writable(getRailContent);

function define_config() {
    this.railTarget = "RAIL_TARGET";
    this.mediaPath = "./RAIL_TARGETmedia/";
    this.fontsPath = "./fonts/";
    this.OSDImagesPath = "./OSDimages/";
    this.objectImagesPath = this.mediaPath + "object_images/";
    this.JSONFile = "RAILRAIL_TARGET.json";
}

var c = new define_config();

export const config = writable(c);

export const state = writable({
    "activePrimary": false,
    "activeSecondary": false,
    "activeTertiary": false,
    "activeImage": 0,
    "activeObject": {},
    "activeMediaCategory": {},
    "dwellScreenActive": false,
    "playPause": "Pause",
    "playPauseAudio": "Play"
});