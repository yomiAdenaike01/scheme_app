<template>
  <el-dialog center :visible.sync="error" width="700px">
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
        <el-button round plain @click="navigateToRegister"
          >Register with scheme cloud</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import Title from "@/components/Title";
export default {
  name: "ErrorDialog",
  data() {
    return {
      companyName: ""
    };
  },
  props: {
    display: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    navigateToRegister() {
      this.$router.push({ name: "register" });
      this.$emit("displayChange", false);
    },
    getClient() {
      this.$emit("getClient");
    }
  },
  computed: {
    error: {
      get() {
        return this.display;
      },
      set(val) {
        console.log(val);
        this.$emit("displayChange", val);
      }
    }
  },
  watch: {
    companyName(val) {
      this.$emit("companyNameChange", val);
    }
  },
  components: {
    Title
  }
};
</script>

<style></style>
