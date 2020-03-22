<template>
  <el-card class="group_container overflow m-3" :class="{ new_group: addNew }">
    <div class="columns">
      <slot></slot>
    </div>

    <div v-if="addNew" class="flex_center columns new_group_container">
      <InformationDisplay
        class="txt_center"
        :displayText="{
          heading: 'Manage users',
          content: `<small class='grey'>Create, edit, remove users / groups.</small>`
        }"
      >
        <el-button
        slot="body"
          class="mt-4"
          icon="el-icon-plus"
          circle
          @click="$emit('createUserGroup', true)"
        ></el-button>
      </InformationDisplay>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import InformationDisplay from "@/components/InformationDisplay";
export default {
  name: "UserGroup",
  props: {
    addNew: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  components: {
    InformationDisplay
  },
  computed: {
    ...mapGetters(["getDefaultColour"])
  }
};
</script>
<style lang="scss" scoped>
.group_container {
  flex: 1;
  height: 100%;
}
</style>
