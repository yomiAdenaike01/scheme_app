<template>
  <el-dialog center :visible.sync="view" width="700px">
    <div class="client_error_dialog">
      <Title
        title="Invalid domain detected."
        subtitle="Re-enter your company name to restart the process."
      />
      <el-input
        class="client_name"
        placeholder="Company Name"
        v-model="companyName"
      >
        <template slot="append">.schemeapp.cloud</template>
      </el-input>
      <div class="button_container m-4">
        <el-button
          round
          type="primary"
          :disabled="companyName.length <= 0"
          @click="getClient"
          >Retry</el-button
        >

        <el-button
          round
          plain
          @click="
            alreadyAtRegistration ? (display = false) : navigateToRegister
          "
          >{{
            alreadyAtRegistration ? "Close" : "Register with scheme cloud"
          }}</el-button
        >
      </div>
    </div>
 
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import Title from "@/components/Title";
export default {
  name: "InvalidClient",
  data() {
    return {
      companyName: ""
    };
  },
  props: {
    invalidClient: {
      type: Boolean,
      default: true
    },
  
  },
  methods: {
    navigateToRegister() {
      this.$router.push({ name: "register" });
      this.display = false;
    },
    getClient() {
      this.$emit("getClient");
    }
  },
  computed: {
    view: {
      get() {
        return this.invalidClient && this.$route.name !='register';
      },
      set(val) {
        this.$emit("toggle", val);
      }
    },
    alreadyAtRegistration() {
      return this.$route.name == "register";
    }
  },
  watch: {
    companyName(val) {
      this.$emit("clientNameChange", val);
    }
  },
  components: {
    Title
  }
};
</script>

<style></style>
