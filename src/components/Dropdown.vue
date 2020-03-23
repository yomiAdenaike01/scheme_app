<template>
  <el-dropdown
    trigger="click"
    class="dropdown_container"
    :placement="position"
    @command="emitCommand"
  >
    <span class="el-dropdown-link dropdown_wrapper">
      <slot></slot>
      <i v-if="icon" class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(item, index) in items"
        :key="index"
        :disabled="item.disabled"
        :divided="item.divided"
        :command="item.command"
        :icon="item.icon"
      >
        <span v-html="item.name"></span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "Dropdown",
  props: {
    commander: Boolean,
    position: {
      type: String,
      default: "bottom-end"
    },
    icon: {
      type: Boolean,
      default: true
    },
    items: {
      type: Array,
      default: () => {
        return [
          {
            name: "item",
            command: "item"
          }
        ];
      }
    }
  },
  methods: {
    emitCommand(e) {
      this.$emit("method", e);
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown_container {
  cursor: pointer;
}
.dropdown_wrapper {
  display: flex;
  align-items: center;
}
</style>
