<script lang="ts">
	import { fade } from "svelte/transition"
	import { state } from "../store"
	import PrimaryNavigation from "./PrimaryNavigation.svelte"
	import SecondaryNavigation from "./SecondaryNavigation.svelte"
    import ContentWindow from "./ContentWindow.svelte"
	export let Rail

    let Content, Category

    $: if ($state.activePrimary !== null) {
        Category = Rail.content[$state.activePrimary]
    } else { 
        Category = null
    }

    $: if ($state.activePrimary !== null && $state.activeSecondary !== null) {
        Content = Rail.content[$state.activePrimary].items[$state.activeSecondary]
    } else { 
        Content = null
    }
</script>

<div id="digital-rail" class="dr-container" transition:fade>
	<PrimaryNavigation {Rail} on:resetState on:setPrimary />
	<SecondaryNavigation Category={Category} on:resetState on:setSecondary />
    <ContentWindow {Content} Type={Category ? Category._type : null} HomeScreen={{title: Rail.title, body: Rail.body}}/>
</div>

<style>
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
</style>
