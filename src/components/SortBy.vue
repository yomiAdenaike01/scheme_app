<template>
  <div class="sortby_container">
    <el-popover v-model="displayPopover" trigger="click">
      <div slot="reference" class="sortby">
        <div class="icon_container">
          <i class="bx bx-filter"></i>
        </div>
        <p class="sortby_body">
          <strong>{{ !selectedItem ? filterText : selectedItem }}</strong>
        </p>
      </div>

      <div
        v-for="(item, index) in items"
        :key="index"
        class="item"
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
$grey: rgb(230, 230, 230);
.sortby {
  display: flex;
  align-items: center;
  background: white;
  padding: 10px;
  justify-content: space-evenly;
  max-width: fit-content;
  border: 2px solid $grey;
  border-radius: 40px;
  margin: 10px;
  cursor: pointer;
  font-size: 0.9em;
  strong {
    padding: 0 20px;
    text-transform: capitalize;
  }
}

p {
  margin: 0;
  &:last-of-type {
    border-left: 2px solid rgb(240, 240, 240);
  }
}
.grey {
  padding: 0 20px;
}
.sortby_body {
  border-left: 2px solid #ccc;
  margin: 0 20px;
}
.icon_container {
  display: flex;
  align-items: center;
  background: var(--colour_primary);
  border-radius: 50%;
  color: white;
  font-size: 1.5em;
  padding: 5px;
}
.item {
  padding: 10px;
  text-transform: capitalize;
  cursor: pointer;
  &:hover {
    background: rgb(240, 240, 240);
  }
}
</style>
