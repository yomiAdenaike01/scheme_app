<template>
  <div class="group_container" :class="{ new_group: addNew }">
    <div class="user_group_inner_container">
      <div v-if="!addNew" class="slot_container">
        <slot></slot>
      </div>

      <div v-else class="new_group_container">
        <InformationDisplay
          class="txt_center"
          :display-text="{
            heading: 'Manage users',
            content: `<small class='grey'>Create, edit, remove users / groups.</small>`
          }"
        >
          <div slot="header" class="i bx bx-user"></div>
          <el-button
            slot="body"
            class="mt-4"
            icon="el-icon-plus"
            circle
            @click="$emit('createUserGroup', true)"
          ></el-button>
        </InformationDisplay>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import InformationDisplay from "@/components/InformationDisplay";
export default {
  name: "UserGroup",
  components: {
    InformationDisplay
  },
  props: {
    addNew: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getDefaultColour"])
  }
};
</script>
<style lang="scss" scoped>
.group_container {
  display: flex;
  flex: 1;
  box-shadow: $box_shadow;
  margin: 10px;
  max-height: 100%;
  &/deep/ {
    .el-card__body {
      padding: 0;
    }
  }
  &.new_group {
    flex: 0.4;
  }
}
.user_group_inner_container {
  display: flex;
  flex: 1;
  max-height: 100%;
}
.new_group_container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  max-height: 100%;
}
.slot_container {
  display: flex;
  flex: 1;
}
</style>
