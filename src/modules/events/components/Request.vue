<template>
  <!-- CHANGE TO FUNCTIONAL -->
  <div
    :class="[`request trigger`, { active: selected._id == request._id }]"
    @click="$emit('setRequest', { request, index })"
  >
    <!-- Dates -->
    <div class="dates_container">
      <span>{{ formatDate(request.start_date, "DD-MM YYYY") }}</span>
    </div>

    <!-- Details -->
    <div :class="`details_container ${request.status}`">
      <h2 class="capitalize">{{ request.type.label }}</h2>
      <strong class="status capitalize">{{ request.status }}</strong>

      <p v-if="request.requested_by._id != user">
        {{ request.requested_by.name }}
      </p>

      <ul>
        <li v-for="(value, key) in dateFieldsXref" :key="key">
          <span class="capitalize">{{ makePretty(key) }}</span
          >:
          {{ value(request[key]) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Request",
  props: {
    selected: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    },
    request: {
      type: Object,
      default: () => {}
    },
    user: {
      type: String
    }
  },
  computed: {
    dateFieldsXref() {
      let dateFormat = "DD-MM YYYY";
      let body = val => {
        return this.formatDate(val, dateFormat);
      };
      let dateKeys = ["start_date", "end_date", "date_created"];
      let dateXref = {};
      for (let i = 0, len = dateKeys.length; i < len; i++) {
        dateXref[dateKeys[i]] = body;
      }
      return dateXref;
    }
  }
};
</script>

<style lang="scss" scoped>
$requests: (
  sent: var(--purple),
  seen: var(--blue),
  rejected: var(--danger),
  approved: var(--success)
);
.request {
  flex: 1;
  border-top: $border;

  border-bottom: $border;
  transition: $default_transition;
  margin: 20px 0;
  display: flex;
  opacity: 0.5;
  &.active {
    opacity: 1;
  }
}

.details_container {
  flex: 1;
  padding: 10px;
  @each $key, $value in $requests {
    &.#{$key} {
      background: rgba($value, 0.08);
      border-left: 5px solid rgba($value, 1);

      &:hover,
      &.active {
        background: rgba($value, 0.1);
      }
      .status {
        color: rgba($value, 1);
      }
    }
  }
}
ul {
  padding: 10px 0;
}
.dates_container {
  font-size: 1.3em;
  padding: 10px;
  flex: 0.1;
}
</style>
