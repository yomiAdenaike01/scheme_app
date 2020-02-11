<template>
  <el-col class="shadow p-4 current_user_column mr-4">
    <header>
      <Avatar :name="userInformation.name" />
      <p class="bold">{{ userInformation.name }}</p>
      <p>{{ groupIDs[userInformation.groupID - 1].name }}</p>
    </header>
    <div class="mt-4">
      <p class="p-1" v-for="(property, value) in cleanuserInformation" :key="property">
        {{ `${value}: ${property}` }}
        <el-divider></el-divider>
      </p>
      <div class="p-1 flex align-center">
        <span class="mr-2">Colour Settings:</span>
        <ColourUnit :colour="colourSettings" />
      </div>
    </div>
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import Tabs from "@/components/Tabs";
import Avatar from "@/components/Avatar";
import ColourUnit from "@/components/ColourUnit";

export default {
  name: "UserInformation",
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["groupIDs"]),

    colourSettings() {
      return this.userInformation.settings.colourSettings.accent;
    },

    cleanuserInformation() {
      let { name, email, dateOfBirth, settings } = this.userInformation;
      let { accent } = settings.colourSettings;

      return {
        Name: name,
        Email: email,
        "Date of birth": dateOfBirth
      };
    }
  },
  components: {
    Tabs,
    Avatar,
    ColourUnit
  }
};
</script>
<style lang="scss" scoped>
header {
  line-height: 1.3em;
}
.current_user_column {
  width: 100%;
  .el-tabs__item {
    width: 100%;
  }
}
</style>
