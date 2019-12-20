<template>
  <el-dropdown class="m-3 grey" @command="emitCommand">
    <span class="el-dropdown-link">
      <slot></slot>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="(item,index) in items"
        :disabled="item.disabled"
        :divided="item.divided"
        :command="item.command"
        :key="index"
      >{{item.name}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "Dropdown",
  props: {
    commander: Boolean,
    items: {
      type: Array
    }
  },
  methods: {
    emitCommand(e) {
      this.$emit("method", e);
    }
  }
};
</script>

<style>
</style>