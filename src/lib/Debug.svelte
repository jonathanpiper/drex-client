<script lang="ts">
	import { state } from "../store"
	export let Rail
	export let con
	$: debugState = JSON.stringify($state, null, 4)

	$: debugContent = JSON.stringify(
		$state.activeSecondary !== null
			? $state.activeTertiary !== null
				? Rail.content[$state.activePrimary].items[$state.activeSecondary].items[$state.activeTertiary]
				: Rail.content[$state.activePrimary].items[$state.activeSecondary]
			: "",
		null,
		"\t"
	)
</script>

<div class="debug-overlay">
	<pre>{debugState}<br />{debugContent}<br />{con.join("\r\n")}
    </pre>
</div>

<style>
	.debug-overlay {
		padding: 20px;
		overflow: scroll;
		/* pointer-events:  */
		position: absolute;
		left: 10%;
		top: 10%;
		width: 80%;
		height: 80%;
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		font-family: "Courier New", Courier, monospace;
		font-size: 20px;
		z-index: 9999;
	}
	pre {
		white-space: pre-wrap;
	}
</style>
