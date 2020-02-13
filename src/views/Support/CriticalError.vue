<template>
  <transition name="fade-transform" mode="out-in" tag="div">
    <div class="h-100 p-4">
   
    <div class="error_container flex_center h-100" >
      <!-- Text container for what to do on errors -->
      <div class="text_container flex_center columns">
        <Icon class="large_icon" icon="el-icon-warning-outline" />
        <br />
        <p class="grey">
          An error has occured with your schemeapp instance, please contact your
          assigned systems administrator to get this resolved. If you don't want
          to do this please click the button below to view the FAQ's.
        </p>
        <div class="button_container flex_center mt-3">
          <el-button
            round
            type="primary"
            size="mediuim"
            @click="$router.push({name:'faqs'})"
          >View FAQ's</el-button>
          <el-button round type="primary" size="mediuim" @click="sendErrorReport">Send Error Report</el-button>
        </div>
      </div>
    </div>
    </div>
  </transition>
</template>

<script>
import Icon from "@/components/Icon";
import { mapState, mapActions } from "vuex";
var parser = require("ua-parser-js");
export default {
  name: "CriticalError",
  data() {
    return {
      email: ""
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    parser() {
      return new UAParser();
    }
  },
  methods: {
    ...mapActions(["request"]),
    sendErrorReport() {
      if (!this.userInformation || !"email" in this.userInformation) {
        this.enterEmail = true;
      }

      let parser = this.parser;

      let payload = {
        content: parser,
        to: this.userInformation.email || this.email,
        date: new Date()
      };

      this.request({
        method: "POST",
        url: "helpers/email",
        data: payload
      });
    }
  },
  components: {
    Icon
  }
};
</script>

<style></style>
