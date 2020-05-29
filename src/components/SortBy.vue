<template>
  <div class="sortby_container">
    <el-popover v-model="displayPopover" trigger="click">
      <div slot="reference" class="sortby input_pill">
        <div class="icon_container">
          <i :class="`bx ${icon}`"></i>
        </div>
        <p class="sortby_body">
          {{ !selectedItem ? filterText : selectedItem }}
        </p>
      </div>

      <div
        v-for="(item, index) in items"
        :key="index"
        class="popover_item"
        @click="
          $emit('itemSelected', item.label);
          displayPopover = false;
        "
      >
        {{ item.label }}
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "SortBy",
  model: {
    event: "itemSelected",
    prop: "selectedItem"
  },
  props: {
    icon: {
      type: String,
      default: "bx-filter"
    },
    items: {
      type: Array,
      default: () => []
    },
    filterText: {
      type: String,
      default: ""
    },
    selectedItem: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      displayPopover: false
    };
  }
};
</script>

<style scoped lang="scss">
.sortby_container {
  font-size: 1.2em;
}
.grey {
  padding: 0 20px;
}
.sortby_body {
  margin: 0 20px;
  white-space: nowrap;
}
.icon_container {
  display: flex;
  align-items: center;
  background: rgba(var(--colour_primary), 1);
  border-radius: 50%;
  color: white;
  font-size: 1.5em;
  padding: 5px;
}
</style>
