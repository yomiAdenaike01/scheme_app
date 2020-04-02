<template>
  <div class="transcript_container">
    {{ transcriptInformation }}
  </div>
</template>

<script>
export default {
  name: "Transcript",
  components: {
    Avatar: () => import("@/components/Avatar")
  },
  props: {
    transcriptInformation: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style></style>
