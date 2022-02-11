<script>
  export let source;
</script>

<figure id="videoContainer">
  <video id="video" autoplay>
    <source src="./video/{source}" type="video/webm" />
  </video>
</figure>

<style>
  figure {

  }
  video {
    width: 100% !important;
    height: auto !important;
  }
</style>
