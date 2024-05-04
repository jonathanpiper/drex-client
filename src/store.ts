import { writable, derived } from "svelte/store"

export const DEBUG = writable(null)

export const state = writable({
	playPause: "Play",
	playPauseAudio: "Play",
	activePrimary: null,
	activeSecondary: null,
	activeTertiary: null,
	activeImage: 0,
	reset() {
		this.dwellScreenActive = false
		this.playPause = "Play"
		this.playPauseAudio = "Play"
		this.activePrimary = null
		this.activeSecondary = null
		this.activeTertiary = null
	},
})

export const previewIdentifier = writable(null)

export const MEDIAPATH = derived(previewIdentifier, ($previewIdentifier) => {
	return $previewIdentifier === null ? "./files/" : ""
})
