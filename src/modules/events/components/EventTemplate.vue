<template>
  <div class="event_template_container">
    <!-- Properties -->
    <div class="properties_container">
      <p
        v-for="(property, propertyIndex) in propertiesDisplay"
        :key="propertyIndex"
      >
        {{ formattedTemplate.content[property] }}
      </p>
    </div>
    <!-- Actions -->
    <div class="actions_container">
      <div
        v-for="(action, actionIndex) in actions"
        :key="actionIndex"
        class="template_action"
        @click="action.body"
      >
        <span>{{ action.label }}</span>
        <i :class="`bx bx-${action.icon}`"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventTemplate",
  props: {
    template: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    propertiesDisplay() {
      return ["assigned_to", "start_date", "end_date"];
    },
    formattedTemplate() {
      return Object.assign({}, this.template, {
        assigned_to: this.template.assigned_to.join(",")
      });
    },
    actions() {
      return [
        {
          label: "Delete",
          body: () => {
            this.$emit("deleteTemplate", {
              _id: this.template._id,
              index: this.index
            });
          }
        },
        {
          label: "Edit",
          body: () => {
            this.$emit("updateTemplate", this.template.content);
          }
        },
        {
          label: "Use",
          body: () => {
            this.$emit("useTemplate", {
              template: this.template,
              index: this.index
            });
          }
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.event_template_container {
  padding: 10px;
  display: flex;
  align-items: center;
  border: $border;
  border-radius: 5px;
}
.properties_container {
  display: flex;
  flex-direction: column;
  line-height: 2em;
  flex: 1;
}
.actions_container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.template_action {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: rgb(250, 250, 250);
}
</style>
