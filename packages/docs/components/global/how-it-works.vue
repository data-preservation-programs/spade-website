<template>
  <div class="miro-embed">
    <iframe
      class="responsive-iframe"
      src="https://miro.com/app/live-embed/uXjVMdqgtPs=/?moveToViewport=-1758,-1612,1544,919"
      frameBorder="0"
      scrolling="no"
      allowFullScreen>

    </iframe>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.miro-embed {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
