<template>
  <el-drawer :visible.sync="returnDisplay" direction="rtl">
    <el-container>
      <el-main>
        <Title
          defaultClass="m-0"
          title="Settings"
          subtitle="Change all aspects of your settings here."
        />
        <PreferencesSelection @prefChange="view = $event" />

        <el-row>
          <el-col v-if="preferencesView == 'data'">
            <h1>User Details</h1>
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item title="Consistency" name="1">
                <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
                <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
              </el-collapse-item>
              <el-collapse-item title="Feedback" name="2">
                <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
                <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
              </el-collapse-item>
              <el-collapse-item title="Efficiency" name="3">
                <div>Simplify the process: keep operating process simple and intuitive;</div>
                <div>Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;</div>
                <div>Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.</div>
              </el-collapse-item>
              <el-collapse-item title="Controllability" name="4">
                <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
                <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.</div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-drawer>
</template>

<script>
import { mapState } from "vuex";
import Title from "@/components/Title";
import PreferencesSelection from "./PreferencesSelection";
export default {
  name: "UserInfoDrawer",
  data() {
    return {
      view: "Data"
    };
  },
  props: {
    display: Boolean
  },
  computed: {
    ...mapState(["currentUser"]),
    currentUserViewConfig() {
      let cUser = this.currentUser;
      let arr = [];
      return arr;
    },
    preferencesView() {
      return this.view.toLowerCase();
    },
    returnDisplay: {
      get() {
        return this.display;
      },
      set(val) {
        this.$emit("toggle", val);
      }
    }
  },
  components: {
    Title,
    PreferencesSelection
  }
};
</script>

<style lang="scss" scoped>
.el-col {
  margin-top: 2em;
}
</style>