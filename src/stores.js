import { writable } from 'svelte/store';

var api_url = 'http://192.168.168.180:9000';

export const apiurl = writable(api_url);

function define_config() {
    this.mediaPath = api_url + "/mediapool/";
    this.localMediaPath = './mediapool/';
    this.OSDImagesPath = this.localMediaPath;
    this.objectImagesPath = this.localMediaPath;
    this.iconsPath = this.localMediaPath;
    this.fontsPath = this.localMediaPath;
    this.imagesPath = this.localMediaPath;
    this.videosPath = this.localMediaPath;
    this.audioPath = this.localMediaPath;
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
    "playPause": "Play",
    "playPauseAudio": "Play"
});

const subs = new Map();

subs.set("musicalmoments", "Musical Moments");
subs.set("factoryfootage", "Making the Instrument");
subs.set("oralhistories", "Voices of the Industry");

export const substitutions = writable(subs);