<template>
  <el-col class="group_container overflow" :class="{ new_group: addNew }">
    <el-card>
      <div class="columns">
        <slot></slot>
      </div>

      <div v-if="addNew" class="flex_center columns new_group_container">
        <LeadIcon class="large_icon grey mb-5" icon="bx bx-group" />
        <h2 class="large">Manager users</h2>
        <small class="grey">Create, edit, remove users / groups.</small>
        <el-button
          class="mt-4"
          icon="el-icon-plus"
          circle
          @click="$emit('createUserGroup', true)"
        ></el-button>
      </div>
    </el-card>
  </el-col>
</template>

<script>
import LeadIcon from "@/components/LeadIcon";
import { mapGetters } from "vuex";
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

  computed: {
    // Can display a list of users
    ...mapGetters(["getDefaultColour"])
  },
  components: {
    LeadIcon
  }
};
</script>
<style lang="scss" scoped>
.group_container {
  width: 70%;
  &.new_group {
    width: 20%;
  }
}
</style>
