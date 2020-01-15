<template>
  <el-dialog center :visible.sync="error" width="700px">
    <div class="client_error_dialog">
      <Title
        title="Error when getting data."
        subtitle="Re-enter your company name to restart the process."
      />
      <el-input class="client_name" placeholder="Company Name" v-model="companyName">
        <template slot="append">.schemeapp.cloud</template>
      </el-input>
      <div class="button_container m-4">
        <el-button round type="primary" :disabled="companyName.length <= 0" @click="getClient">Retry</el-button>
        <el-button
          round
          plain
          @click="$router.push({ name: 'register' }), (error = false)"
        >Register with scheme cloud</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
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
        this.$emit("displayChange", val);
      }
    }
  },
  watch: {
    companyName(val) {
      this.$emit("companyNameChange", val);
    }
  }
};
</script>

<style>
</style>