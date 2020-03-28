<template>
  <div
    class="user_container"
    @click="
      UPDATE_DIALOG_INDEX({
        dialog: 'viewUser',
        view: true,
        data: userInformation
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

    <div class="text_content">
      <p class="member_name">{{ name }}</p>
      <small class="grey">{{ foundGroupName }}</small>
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
  flex: 1;
  min-height: 50px;
  max-height: 50px;
  border: 1px solid #ebeef5;
  padding: 20px;
  margin: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: $default_transition background;
  &:hover {
    background: $hover_grey;
  }
}
.text_content {
  margin-left: 20px;
}
</style>
