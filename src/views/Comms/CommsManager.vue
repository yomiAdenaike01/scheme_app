<template>
  <div class="comms_container" v-loading="loading">
    <CommsFilters />
    <CommsList />
    <CommsWindow />
  </div>
</template>

<script>
import CommsList from "./components/CommsList";
import CommsWindow from "./components/CommsWindow";
import CommsFilters from "./components/CommsFilters";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "CommsManager",
  data() {
    return {
      loading: false
    };
  },
  activated() {
    if (!this.hasEntries(this.activeTranscript)) {
      this.loading = true;
      this.getTranscripts()
        .then(response => {
          this.loading = false;
          if (response.length > 0) {
            this.UPDATE_ACTIVE_TRANSCRIPT(response[0].transcriptID);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    }
  },
  methods: {
    ...mapActions("Comms", ["getTranscripts"]),
    ...mapMutations("Comms", ["UPDATE_ACTIVE_TRANSCRIPT"])
  },
  computed: {
    ...mapState("Comms", ["activeTranscript"])
  },
  components: {
    CommsList,
    CommsWindow,
    CommsFilters
  }
};
</script>

<style lang="scss" scoped>
.comms_container {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
