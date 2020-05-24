<template>
  <div class="event_template_container">
    <div class="properties_container">
      <h4 :class="`property_item name capitalize`">
        {{ template.name }}
      </h4>
      <small
        v-for="(property, propertyIndex) in propertiesDisplay"
        :key="propertyIndex"
        :class="`property_item ${property}`"
      >
        {{ formattedContent[property] }}
      </small>
    </div>

    <div class="actions_container">
      <div
        v-for="(action, actionIndex) in actions"
        :key="actionIndex"
        :class="`template_action trigger ${action.label}`"
        @click="action.body"
      >
        <small class="capitalize">{{ makePretty(action.label) }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

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
    ...mapGetters("Team", ["userLookup"]),
    propertiesDisplay() {
      return ["name", "assigned_to", "start_date", "end_date"];
    },

    assignedTo() {
      return this.template.content.assigned_to.map(assignee => {
        return this.userLookup(assignee)?.name;
      });
    },

    formattedContent() {
      let content = this.template.content;
      return {
        ...content,
        assigned_to: this.assignedTo.join(", "),
        start_date: this.formatDate(content.start_date),
        end_date: this.formatDate(content.end_date)
      };
    },

    actions() {
      return [
        {
          label: "delete",
          icon: "trash",

          body: () => {
            this.$emit("deleteTemplate", {
              _id: this.template._id,
              index: this.index
            });
          }
        },

        {
          label: "use_template",
          icon: "plus",
          body: () => {
            let { start_date, end_date } = this.template.content;
            let dates = [start_date, end_date];
            this.$emit("useTemplate", {
              dates,
              ...this.template.content
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
  margin: 10px;
  display: flex;
  border: $border;
  border-radius: 5px;
  flex: 1;
  justify-content: space-between;
}
.properties_container {
  display: flex;
  flex-direction: column;
  line-height: 2em;
  flex: 1;
  padding: 10px;
}
.actions_container {
  display: flex;
  flex: 0.5;
}
.template_action {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  background: rgb(252, 252, 252);

  &.delete {
    background: rgba(var(--danger), 0.1);
    color: rgba(var(--danger), 1);
  }
  &.use_template {
    background: rgba(var(--success), 0.1);
    color: rgba(var(--success), 1);
  }
}
.property_item {
  &.assigned_to {
    font-weight: bold;
  }
}
</style>
