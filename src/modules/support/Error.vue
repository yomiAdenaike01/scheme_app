<template>
  <transition name="fade-transform" mode="out-in" tag="div">
    <div class="critical_error_wrapper">
      <div class="error_container">
        <div class="text_container flex_center columns">
          <p class="grey error_content">
            An error has occured with your schemeapp instance, please contact
            your assigned systems administrator to get this resolved.
          </p>
        </div>
      </div>
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
    this.DELETE_GLOBAL_INTERVAL();
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
    ...mapMutations(["DELETE_GLOBAL_INTERVAL"]),

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
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow-x: hidden;
  .grey {
    margin-bottom: 50px;
  }
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
.error_information_container {
  display: flex;
  justify-content: center;
  align-items: center;
  h4 {
    margin: 20px 0;
  }
}
.error_information_inner_container {
  padding: 20px;
  box-shadow: $box_shadow;
}
.error_information {
  display: inline-block;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
