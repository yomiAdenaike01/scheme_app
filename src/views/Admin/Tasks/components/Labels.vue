<template>
  <!-- Display labels -->
  <div class="labels_container">
    <div v-if="labels.length > 0" class="display_labels">
      <div v-for="label in labels" :key="label._id" class="label">
        {{ label }}
      </div>
    </div>
    <el-popover v-model="displayPopover">
      <span slot="reference" class="trigger">Create Label</span>
      <div class="labels_functionality">
        <header>
          <i
            v-if="displayForm"
            class="bx bx-arrow-back trigger"
            @click="displayForm = false"
          ></i>
          <span>Labels</span>
        </header>
        <el-input
          v-model="labelSearch"
          size="mini"
          placeholder="Search labels..."
        />
        <h4>Labels</h4>
        <div
          v-for="label in labels"
          :key="label._id"
          class="label"
          :style="{ backgroundColor: label.colour }"
        >
          <span>{{ label }}</span>
          <el-button
            icon="el-icon-write"
            @click="displayForm = true"
          ></el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "Labels",

  props: {
    labels: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      labelSearch: "",
      displayForm: false,
      displayPopover: false
    };
  }
};
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}
</style>
