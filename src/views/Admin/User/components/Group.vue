<template>
  <div class="group_container shadow m-3 p-3">
    <div class="flex_center columns">
      <div v-if="!addNew">
        <el-button class="grey large_icon no_events borderless" icon="el-icon-user"></el-button>
      </div>
      <slot></slot>
    </div>

    <div v-if="addNew" class="flex_center columns new_group_container h-100">
      <Icon class="large_icon grey mb-5" icon="el-icon-user" :bg="getDefaultColour" />
      <h2 class="large">Create new user group</h2>
      <small class="grey">Creating a new user group means new tasks and new shift groups</small>
      <el-button
        size="mini"
        class="mt-4"
        type="primary"
        icon="el-icon-plus"
        round
        @click="$emit('createUser',true)"
      >Create new user group</el-button>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/Icon";
import { mapGetters } from "vuex";
export default {
  name: "Group",
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
    Icon
  }
};
</script>
<style lang="scss" scoped>
.new_group_indicator {
  color: rgb(226, 226, 226);
}
.new_group_container {
}
</style>
