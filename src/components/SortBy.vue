+<template functional>
  <div class="sortby_container">
    <el-popover trigger="click">
      <div slot="reference" class="sortby">
        <p>
          <span class="grey">Sort by</span>
          <strong>{{ props.selectedItem }}<i class="bx bx-filter"></i></strong>
        </p>
        <i class="bx bxs-down-arrow"></i>
      </div>
      +
      <div
        v-for="(item, index) in props.items"
        :key="index"
        class="item"
        @click="$emit('itemSelected', item)"
      >
        {{ item }}
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
    selectedItem: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="scss">
$grey: rgb(230, 230, 230);
.sortby {
  display: flex;
  align-items: center;
  border: 2px solid $grey;
  max-width: 230px;
  border-radius: 10px;
  margin: 10px;
  cursor: pointer;
}
.grey {
  border-right: 1px solid #ccc;
}
.item{
    +
}
</style>
