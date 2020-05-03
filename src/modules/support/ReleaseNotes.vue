<template>
  <div v-loading="loading" class="release_notes_container">
    <vue-markdown v-if="rNotes.length > 0">{{ rNotes }}</vue-markdown>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import VueMarkdown from "vue-markdown";
export default {
  name: "ReleaseNotes",
  components: {
    VueMarkdown
  },
  data() {
    return {
      loading: false,
      rNotes: ""
    };
  },
  activated() {
    this.loading = true;
    this.request({
      method: "GET",
      url: "extensions/releases",
      disableNotification: true
    }).then(response => {
      this.rNotes = window.atob(response);
      this.loading = false;
    });
  },
  methods: {
    ...mapActions(["request"])
  }
};
</script>

<style lang="scss" scoped>
.release_notes_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
