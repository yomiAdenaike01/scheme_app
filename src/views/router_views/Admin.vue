<template>
  <div class="admin_container">
    <keep-alive>
      <slide-x-left-transition mode="out-in">
        <router-view></router-view>
      </slide-x-left-transition>
    </keep-alive>
    <ProfileDialog />
  </div>
</template>

<script>
import ProfileDialog from "@/views/Admin/Users/Profile/ProfileDialog";
import { SlideXLeftTransition } from "vue2-transitions";

export default {
  name: "Admin",
  components: {
    ProfileDialog,
    SlideXLeftTransition
  }
};
</script>

<style lang="scss" scoped>
.admin_container {
  display: flex;
  flex: 1;
}
</style>
