<script>
    export let identifier
</script>

<div class="loading-container"><h1>Now loading Museum of Making Music Digital Rail {identifier || ""}</h1></div>

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
</style>