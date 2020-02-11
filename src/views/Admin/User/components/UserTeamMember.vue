<template>
  <div
    class="team_member flex p-4 mt-1"
    @click="UPDATE_VIEW_TEAM_MEMBER({ view: true, id: data._id })"
  >
    <Avatar :name="data.name" />

    <div class="flex columns">
      <div class="text_content ml-2">
        <p class="rbold m-0 p-0">{{ data.name }}</p>
        <small>{{ groupIDs[data.groupID - 1].name }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "@/components/Avatar";

import { mapState, mapMutations } from "vuex";
import TeamView from "../../Team/TeamView.vue";
export default {
  name: "UserTeamMember",
  props: {
    data: Object
  },
  computed: {
    ...mapState("Admin", ["groupIDs"])
  },
  methods: {
    ...mapMutations("Admin", ["UPDATE_VIEW_TEAM_MEMBER"])
  },
  components: {
    Avatar,
    TeamView
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
