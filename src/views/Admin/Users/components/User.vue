<template>
  <div
    class="team_member flex p-4 mt-1"
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
      <div class="text_content ml-2">
        <p class="member_name m-0 p-0">{{ name }}</p>
        <small>{{ group }}</small>
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
      return this.getGroupName("user", this.userInformation.groupID).name;
    },
    group() {
      let { groupID } = this.userInformation;
      let name = "Group not found";
      if (this.hasEntries(this.clientInformation)) {
        let { userGroups } = this.clientInformation;
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
.team_member {
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
