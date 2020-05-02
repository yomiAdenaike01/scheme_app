<template>
  <div class="team_member_container" @click="viewUser">
    <Avatar :name="name">
      <OnlineIndicator :is-online="memberInformation.is_online" />
    </Avatar>

    <div class="text_content">
      <p class="member_name">{{ name }}</p>
      <small class="grey">{{ groupName }}</small>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import Avatar from "@/components/Avatar";
import OnlineIndicator from "@/components/OnlineIndicator";

export default {
  name: "TeamMember",
  components: {
    Avatar,
    OnlineIndicator
  },
  props: {
    memberInformation: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  computed: {
    ...mapState(["clientInformation"]),
    name() {
      return this.memberInformation.name;
    },
    groupName() {
      return this.memberInformation?.user_group?.label;
    },
    group() {
      let name = "Group not found";
      if (this.hasEntries(this.clientInformation)) {
        name = this.groupName;
      }
      return name;
    }
  },
  methods: {
    ...mapMutations(["UPDATE_OVERLAY_INDEX"]),
    viewUser() {
      this.UPDATE_OVERLAY_INDEX({
        overlay: "profile",
        view: true,
        data: this.memberInformation
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.team_member_container {
  display: flex;
  flex: 1;
  align-items: center;
  min-height: 50px;
  max-height: fit-content;
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
p {
  padding: 0;
  margin: 0;
}
.member_name {
  text-transform: capitalize;
}
</style>
