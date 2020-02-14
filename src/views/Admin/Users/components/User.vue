<template>
  <div
    v-if="hasEntries(data)"
    class="team_member flex p-4 mt-1"
    @click="UPDATE_VIEW_TEAM_MEMBER({ view: true, id: data._id })"
  >
    <Avatar :name="data.name" />

    <div class="flex columns">
      <div class="text_content ml-2">
        <p class="rbold m-0 p-0">{{ data.name }}</p>
        <small>{{ group }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "@/components/Avatar";

import { mapState, mapMutations } from "vuex";
export default {
  name: "User",
  props: {
    data: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  computed: {
    ...mapState(["clientInformation"]),
    group() {
      let { groupID } = this.data;
      let name = "Group not found";
      if (this.hasEntries(this.clientInformation)) {
        let { userGroups } = this.clientInformation;
        name = userGroups.find(({ value }) => {
          return value == groupID;
        }).name;
      }
      return name;
    }
  },
  methods: {
    ...mapMutations("Admin", ["UPDATE_VIEW_TEAM_MEMBER"])
  },
  components: {
    Avatar
  }
};
</script>

<style lang="scss" scoped>
.team_member {
  border: $border;
  overflow-x: hidden;
  transition: 0.56s ease background;
  cursor: pointer;
  &:hover {
    background: #f9f9f9;
  }
}
</style>
