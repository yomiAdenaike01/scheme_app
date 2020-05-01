import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["getActiveOverlay"]),
    displayOverlay() {
      return this.getActiveOverlay()?.name == this.globalOverlayName;
    }
  },
  methods: {
    ...mapActions(["closeActiveOverlay"]),
    ...mapMutations(["UPDATE_OVERLAY_INDEX"]),
    closeOverlay(overlay) {
      let activeOverlay = this.getActiveOverlay(overlay);
      if (activeOverlay) {
        this.closeActiveOverlay(overlay);
      } else {
        this.$emit("close");
      }
    }
  }
};
