<template>
  <div
    class="user_container"
    @click="
      UPDATE_DIALOG_INDEX({
        dialog: 'viewUser',
        view: true,
        data: userInformation._id
      })
    "
  >
    <el-badge
      v-if="displayPrescence"
      is-dot
      :type="userInformation.isOnline ? 'success' : 'danger'"
      class="item"
    >
      <Avatar :name="name" />
    </el-badge>
    <Avatar v-else :name="name" />

    <div class="flex columns">
      <div class="text_content">
        <p class="member_name">{{ name }}</p>
        <small>{{ foundGroupName }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";

import Avatar from "@/components/Avatar";
export default {
  name: "User",
  components: {
    Avatar
  },
  props: {
    displayPrescence: {
      type: Boolean,
      default: true
    },
    userInformation: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  computed: {
    ...mapState(["clientInformation"]),
    ...mapGetters("Admin", ["getGroupName"]),
    name() {
      return this.userInformation.name;
    },
    foundGroupName() {
      return this.getGroupName("user", this.userInformation.groupID)?.label;
    },
    group() {
      let name = "Group not found";
      if (this.hasEntries(this.clientInformation)) {
        name = this.foundGroupName;
      }
      return name;
    }
  },
  methods: {
    ...mapMutations(["UPDATE_DIALOG_INDEX"])
  }
};
</script>

<style lang="scss" scoped>
.user_container {
  display: flex;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  cursor: pointer;
  overflow-x: hidden;
  transition: $default_transition background;
  &:hover {
    background: $hover_grey;
  }
}
</style>
