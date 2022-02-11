import { writable, readable } from 'svelte/store';
//import railJSON from './JSON/RailRAIL_TARGET.json';

// try {
//     var railJSON = await fetch("http://192.168.168.180:4000/drex/RAIL_TARGET").json()
// } catch (err) {
//     console.log(err);
// }

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
    "dwellScreenActive": false
});

// async function getJSONData(url) {
// 	const loading = writable(false)
// 	const error = writable(false)
// 	const data = writable({})
	
// 	async function get() {
// 		loading.set(true)
// 		error.set(false)
// 		try {
// 			const response = await fetch(url)
// 			data.set(await response.json())
// 		} catch(e) {
// 			error.set(e)
// 		}
// 		loading.set(false)
// 	}
	
// 	get()
	
// 	return [ data, loading, error, get]
// }

// function lowerCase(str) {
//     return str.toLowerCase();
// }

// const railJSON = getJSONData("http://192.168.168.180:4000/drex/rail" + lowerCase("RAIL_TARGET"));
// console.log(railJSON);
// export const rail = readable(railJSON);