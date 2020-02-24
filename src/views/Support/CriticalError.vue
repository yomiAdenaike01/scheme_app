<template>
  <transition name="fade-transform" mode="out-in" tag="div">
    <div class="h-100 p-4">
      <div class="error_container flex_center">
        <!-- Text container for what to do on errors -->
        <div class="text_container flex_center columns">
          <LeadIcon class="large_icon" icon="el-icon-warning-outline" />
          <br />
          <p class="grey error_content">
            An error has occured with your schemeapp instance, please contact
            your assigned systems administrator to get this resolved. If you
            don't want to do this please click the button below to view the
            FAQ's.
          </p>
          <div class="button_container flex_center mt-3">
            <el-button round type="primary" plain @click="$router.push({ name: 'faqs' })">View FAQ's</el-button>
            <el-button
              round
              type="primary"
              @click="displayDetails = !displayDetails"
            >Display Error Report</el-button>
          </div>
        </div>
      </div>
      <el-collapse-transition>
        <div class="flex_center" v-if="displayDetails">
          <el-card class="m-5">
            <h4
              class="txt_center"
            >The following information will be sent to your system administrator</h4>
            <div class="flex_center columns">
              <div class="info_wrapper p-2 m-3 txt_center">
                <small>{{JSON.stringify(getUAInformation)}}</small>
                <small>{{JSON.stringify(errorInformation)}}</small>
              </div>
              <el-button plain size="small" @click="sendErrorReport">Send Error Report</el-button>
            </div>
          </el-card>
        </div>
      </el-collapse-transition>
    </div>
  </transition>
</template>

<script>
import LeadIcon from "@/components/LeadIcon";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "CriticalError",
  data() {
    return {
      email: "",
      displayDetails: false
    };
  },
  computed: {
    ...mapState(["userInformation", "errorInformation"]),
    ...mapGetters(["getUAInformation"]),
    emailInformation() {
      return {
        ...this.getUAInformation,
        ...this.errorInformation
      };
    }
  },
  methods: {
    ...mapActions(["request", "genEmail"]),

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
  },
  components: {
    LeadIcon
  }
};
</script>

<style lang="scss" scoped>
.error_content {
  text-align: center;
  width: 700px;
  line-height: 2em;
}
.info_wrapper {
  max-width: 500px;
  border: $border;
  background: whitesmoke;
  color: rgb(50, 50, 50);
}
</style>
