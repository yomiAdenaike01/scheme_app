<template>
  <transition name="fade-transform" mode="out-in" tag="div">
    <div class="critical_error_wrapper h-100 p-4">
      <div class="error_container flex_center">
        <div class="text_container flex_center columns">
          <p class="grey error_content">
            An error has occured with your schemeapp instance, please contact
            your assigned systems administrator to get this resolved. If you
            don't want to do this please click the button below to view the
            FAQ's.
          </p>
        </div>
      </div>
      <el-collapse-transition>
        <div class="flex_center">
          <el-card class="m-5">
            <h4 class="txt_center">
              The following information will be sent to your system
              administrator
            </h4>
            <div class="flex_center columns">
              <div class="info_wrapper p-2 m-3 txt_center">
                <small class="error_information">{{
                  JSON.stringify(getDeviceInformation)
                }}</small>
                <small class="error_information">{{
                  JSON.stringify(errorInformation)
                }}</small>
              </div>
              <el-button plain size="small" @click="sendErrorReport"
                >Send Error Report</el-button
              >
            </div>
          </el-card>
        </div>
      </el-collapse-transition>
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "Error",

  data() {
    return {
      email: ""
    };
  },
  activated() {
    if (!this.hasEntries(this.errorInformation)) {
      this.$router.push({ name: "events" });
    }
    this.CLEAR_GLOBAL_INTERVAL();
  },

  computed: {
    ...mapState(["userInformation", "errorInformation"]),
    ...mapGetters(["getDeviceInformation"]),
    emailInformation() {
      return {
        ...this.getDeviceInformation,
        ...this.errorInformation
      };
    }
  },
  methods: {
    ...mapActions(["request", "genEmail"]),
    ...mapMutations(["CLEAR_GLOBAL_INTERVAL"]),

    sendErrorReport() {
      this.genEmail({
        subject: "Reminder",
        to: "schemeapp@gmail.com",
        context: {
          body: JSON.stringify(this.emailInformation)
        }
      })
        .then(response => {
          return response;
        })
        .catch(err => {
          return err;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.critical_error_wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: hidden;
}
.error_content {
  line-height: 2em;
  text-align: center;
  width: 700px;
}
.info_wrapper {
  background: whitesmoke;
  border: $border;
  color: rgb(50, 50, 50);
  max-height: 400px;
  max-width: 500px;
  overflow-x: hidden;
}
.error_information {
  display: inline-block;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
