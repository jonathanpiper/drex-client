import { writable } from 'svelte/store'

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
        console.log(this)
    }
})