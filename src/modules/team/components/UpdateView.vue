<template>
  <div class="view_container">
    <div class="team_overlay_body">
      <Avatar v-if="inputs.name.length > 0" :size="100" :name="inputs.name" />
      <div v-for="(value, key) in inputs" :key="key">
        <p
          v-if="value && value.length > 0"
          :class="[
            `${key}_value`,
            {
              grey: key != 'name',
              'bold capitalize': key == 'name'
            }
          ]"
        >
          {{ key == "user_group" ? userGroup : value }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "@/components/Avatar";
export default {
  name: "UpdateView",
  components: {
    Avatar
  },
  props: {
    userGroup: {
      type: String,
      default: ""
    },
    inputs: {
      type: Object,
      default: () => {}
    },

    mode: {
      type: String,
      default: "create"
    }
  }
};
</script>
