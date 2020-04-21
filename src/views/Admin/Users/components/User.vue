<template>
  <div
    class="user_container"
    @click="
      UPDATE_DIALOG_INDEX({
        dialog: 'profile',
        view: true,
        data: userInformation
      })
    "
  >
    <Avatar :name="name">
      <OnlineIndicator :is-online="userInformation.isOnline" />
    </Avatar>

    <div class="text_content">
      <p class="member_name">{{ name }}</p>
      <small class="grey">{{ groupName }}</small>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "User",
  components: {
    Avatar: () => import("@/components/Avatar"),
    OnlineIndicator: () => import("@/components/OnlineIndicator")
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
    name() {
      return this.userInformation.name;
    },
    groupName() {
      return this.userInformation?.userGroup?.label;
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
    ...mapMutations(["UPDATE_DIALOG_INDEX"])
  }
};
</script>

<style lang="scss" scoped>
.user_container {
  display: flex;
  flex: 1;
  align-items: center;
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
p {
  padding: 0;
  margin: 0;
}
.member_name {
  text-transform: capitalize;
}
</style>
