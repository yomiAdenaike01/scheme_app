import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState(["overlayIndex"]),
    currentOverlay() {
      return this.overlayIndex[this.overlayName];
    },
    isActive() {
      return this.currentOverlay.view;
    },
    activeOverlayData() {
      return this.currentOverlay.data;
    }
  },
  methods: {
    ...mapActions(["closeOverlay"]),
    deactivateOverlay() {
      this.closeOverlay(this.overlayName);
    }
  }
};