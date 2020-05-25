<template>
  <div class="team_sidebar">
    <div class="team_group_container">
      <div class="filter_team_members">
        <i class="bx bx-search"></i>
        <input
          v-model="search"
          class="s_input no_border_radius fill"
          type="text"
          placeholder="Search team members"
        />
        <i
          v-if="search.length > 0"
          class="bx bx-x trigger"
          @click="search = ''"
        ></i>

        <i
          v-if="hasPermission"
          class="bx bx-plus trigger"
          @click="$emit('view', { displayOverlay: true, mode: 'create' })"
        ></i>
      </div>

      <div v-if="teamMembers.length > 0" class="row_wrapper">
        <div
          v-for="(count, i) in teamMembers"
          :key="`${count}${i}`"
          class="user_group_row"
        >
          <div
            v-for="(group, index) in count"
            :key="`${group.groupID}${index}`"
            class="user_group_col"
          >
            <div :key="`${group.groupID}${genID()}`" class="team_wrapper">
              <div class="icon_text_container">
                <div class="divider"></div>
                <span class="capitalize">{{ group.label }}</span>
                <div class="divider"></div>
              </div>
              <div v-if="group.teamMembers.length > 0">
                <div
                  v-for="(member, index) in group.teamMembers"
                  :key="member._id"
                  :class="{
                    active: selected._id == member._id
                  }"
                  class="team_member_container"
                  @click="$emit('selected', { member, index })"
                >
                  <Avatar :name="member.name" :size="40">
                    <OnlineIndicator :is-online="member.is_online" />
                  </Avatar>
                  <div class="text_content">
                    <p class="member_name">{{ member.name }}</p>
                    <small class="grey">{{ member.email }}</small>
                  </div>
                  <i
                    v-if="member._id == userInformation._id"
                    class="is_user_badge bx bxs-badge-check"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TeamMember from "./TeamMember";
import genID from "@/mixins/genID";
import Avatar from "@/components/Avatar";
import OnlineIndicator from "@/components/OnlineIndicator";
import { mapState } from "vuex";
export default {
  name: "TeamMembers",
  data() {
    return {
      search: ""
    };
  },
  computed: {
    ...mapState(["userInformation"])
  },
  watch: {
    search(val) {
      this.$emit("search", val);
    }
  },
  components: {
    TeamMember,
    Avatar,
    OnlineIndicator
  },
  mixins: [genID],
  props: {
    teamMembers: {
      type: Array,
      default: () => []
    },
    hasPermission: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style scoped lang="scss">
.team_sidebar {
  border-right: $border;
}
.team_group_container {
  display: flex;
  flex: 0.2;
  min-width: 300px;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden;
}
.filter_team_members {
  display: flex;
  align-items: center;
  border-bottom: $border;
  padding: 10px;
  .bx {
    font-size: 1.4em;
    color: #999;
    flex: 0.01;
  }
}
.row_wrapper {
  padding-top: 20px;
  display: flex;
  flex: 1;
}
.user_group_row {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.user_group_col {
  display: flex;
  padding: 10px;
}
.team_wrapper {
  display: flex;
  flex: 1;
  max-height: fit-content;
  flex-direction: column;
}
.icon_text_container {
  display: flex;
  align-items: center;
  .divider {
    flex: 1;
    height: 2px;
    background: whitesmoke;
  }
  span {
    text-transform: capitalize;
    justify-content: flex-start;
    padding: 0 10px;
  }
  color: #222;
  font-size: 0.9em;
  padding: 10px 0px;
}

.team_member_container {
  display: flex;
  flex: 1;
  align-items: center;
  min-height: 50px;
  max-height: fit-content;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: $default_transition background;
  &:hover,
  &.active {
    background: rgb(248, 248, 248);
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
