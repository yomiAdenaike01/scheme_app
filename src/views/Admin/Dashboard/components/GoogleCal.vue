<template>
  <el-card shadow="none" class="flex_center columns google_cal_sync_container">
    <Nocontent v-bind="noGoogleCal">
      <el-button size="mini" @click="initGoogleAPI"
        >Configure Google calendar</el-button
      >
    </Nocontent>
  </el-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VueGAPI from "vue-gapi";
import Nocontent from "@/components/Nocontent";
export default {
  name: "GoogleCal",
  async created() {
    await this.$getGapiClient();
  },
  computed: {
    noGoogleCal() {
      return {
        text:
          "You have encountered a critical server error, to proceed please contact support so that this can be fixed",
        icon: "el-icon-date",
        buttonText: "Configure google calendar"
      };
    }
  },
  data() {
    return {
      apiConfig: {
        GOOGLE_CLIENT_ID:
          "731841805904-rcgjk7g81v9l37b8dci5382siohla6n7.apps.googleusercontent.com",
        GOOGLE_CLIENT_SECRET: "bJTsMWaSH5pyccce3uzXSz2C",
        scope: "https://www.googleapis.com/auth/calendar"
      }
    };
  },
  methods: {
    initGoogleAPI() {
      this.$login();
    }
  },
  components: {
    Nocontent
  }
};
</script>

<style lang="scss" scoped>
.running {
  animation-name: rotating;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
