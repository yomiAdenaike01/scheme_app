<template>
  <el-card class="group_container overflow m-3" :class="{ new_group: addNew }">
    <div class="columns">
      <slot></slot>
    </div>

    <div v-if="addNew" class="flex_center columns new_group_container">
      <h2 class="large">Manage users</h2>
      <small class="grey">Create, edit, remove users / groups.</small>
      <el-button
        class="mt-4"
        icon="el-icon-plus"
        circle
        @click="$emit('createUserGroup', true)"
      ></el-button>
    </div>
  </el-card>
</template>

<script>
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
    ...mapGetters(["getDefaultColour"])
  },

};
</script>
<style lang="scss" scoped>
.group_container {
  flex: 1;
  height: 100%;
}
</style>
