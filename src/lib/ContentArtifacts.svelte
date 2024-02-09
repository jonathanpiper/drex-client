<script lang="ts">
	import { state } from "../store"
	import { MEDIAPATH } from "../const"
	import SvelteMarkdown from "svelte-markdown"
	import OSD from "./OSD.svelte"
    import { marked } from "marked"
	export let Content

    console.log(Content)
</script>

<div class="dr-content-artifacts">
	{#if Content !== null}
		<div class="dr-content-artifact-text">
			<h2>{Content.maker}</h2>
			<h2>{@html Content.title}</h2>
			<h2>{Content.date}</h2>
			<div>{@html marked.parse(Content.description)}</div>
			<p>{Content.credit}</p>
		</div>
		<div class="dr-content-artifact-image">
			{#key Content}
				<OSD {Content} />
			{/key}
		</div>
	{:else}
		<img id="instruction-artifact" src="{MEDIAPATH}INSTRUCTION-ARTIFACT.png" alt="Choose an artifact" />
	{/if}
</div>

<style>
	#instruction-artifact {
		position: fixed;
		top: 300px;
		left: 1220px;
		width: auto;
		height: 420px;
	}
	.dr-content-artifacts {
		display: flex;
		flex-direction: row;
		height: 1320px;
	}

	.dr-content-artifact-text {
		width: calc(1180px-160px-2px);
		padding: 80px;
	}

	:global(.dr-content-artifacts h2) {
		font-family: var(--dr-body-font);
		font-weight: 500;
		font-size: 48px;
		margin: 0px;
	}

	:global(.dr-content-artifacts h2:last-of-type) {
		margin-bottom: 20px;
	}

	:global(.dr-content-artifacts p) {
		font-family: var(--dr-body-font);
		font-size: 36px;
	}

	:global(.dr-content-artifacts p:last-of-type) {
		font-family: var(--dr-body-font);
		font-style: italic;
		font-size: 36px;
	}

	.dr-content-artifact-image {
		width: 1000px;
		align-self: flex-end;
		/* float: right; */
		border-left: solid 2px;
		border-color: white;
		align-content: center;
	}

	/* .dr-content-artifact-image img {
    width: 1000px;
    height: 1316px;
    object-fit: cover;
  } */
</style>
