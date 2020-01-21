<template>
  <div class="team_member flex">
    <Avatar :name="data.name" />
    <div class="text_content">
      <strong>Locumn</strong>
      <span>Employee Type</span>
    </div>
    <div class="text_content">
      <strong>Locumn</strong>
      <span>Employee Type</span>
    </div>
    {{data}}
  </div>
</template>

<script>
import Avatar from "@/components/Avatar";
export default {
  name: "UserTeamMember",
  props: {
    data: Object
  },
  components: {
    Avatar
  }
};
</script>

<style lang="scss" scoped>
.team_member {
  overflow-x: hidden;
}
</style>