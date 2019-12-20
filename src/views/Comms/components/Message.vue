<template>
  <el-row class="message">
    <el-col :style="stylePositions">
      <div class="m-2">
        <p style="color:#999; font-size:0.7em;">{{format(message.time,"DD/MM/YYYY hh:mm a")}}</p>
        <p class="p-3" :style="colors">{{message.content}}</p>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from "vuex";
import dates from "@/mixins/dates";
export default {
  name: "Message",
  mixins: [dates],
  props: {
    message: Object
  },
  computed: {
    ...mapState(["currentUser"]),
    stylePositions() {
      let styleObj = {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start"
      };
      if (this.isUserTheSender == "user") {
        styleObj.justifyContent = "flex-end";
      }
      return styleObj;
    },

    colors() {
      let styleObj = {
        borderRadius: "10px 10px 10px 0px",
        backgroundColor: "rgb(220,220,220)"
      };
      if (this.isUserTheSender == "user") {
        styleObj.borderRadius = "10px 10px 0px 10px";
        styleObj.backgroundColor = "#2f74eb";
      }
      return styleObj;
    },
    isUserTheSender() {
      const message = this.message;
      const currentUser = this.currentUser;
      if (message.sender_id == currentUser._id) {
        return "user";
      }
      return "other";
    }
  }
};
</script>

<style lang="scss" scoped>
.message {
  display: flex;
  color: white;
}
</style>