<template>
  <el-radio-group v-model="settings" size="small">
    <el-radio-button
      v-for="(item, index) in selection"
      :label="item.label"
      :key="index"
    ></el-radio-button>
  </el-radio-group>
</template>

<script>
export default {
  name: 'SettingsSelection',
  props: {
    active: String,
    selection: Array
  },
  data() {
    return {
      settings: this.selection[0].label
    }
  },
  watch: {
    settings(val) {
      this.$emit('prefChange', val)
    }
  }
}
</script>
