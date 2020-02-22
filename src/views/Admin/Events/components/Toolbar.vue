<template>
  <el-row type="flex" :gutter="10" align="middle">
    <el-col>
      <!-- Button collection -->
      <el-button
        :icon="button.icon ? button.icon : null"
        v-for="(button, key) in buttons"
        :round="button.round"
        :type="button.type ? button.type : 'primary'"
        :key="key"
        size="small"
        :plain="button.plain"
        @click="button.method"
      >{{ button.label }}</el-button>
      <el-button
        :icon="hasGcal ? 'el-icon-check' : 'el-icon-refresh'"
        :disabled="hasGcal"
        round
        size="small"
        @click="initGcal"
        plain
      >
        {{
        !hasGcal
        ? "Integrate with google calendar"
        : "Integrated with google calendar"
        }}
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "Toolbar",

  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_DIALOG_INDEX"]),

    initGcal() {
      this.request(
        {
          method: "POST",
          url: "services/googlecal",
          disableNotification: true,
          data: {
            id: this.userInformation._id,
            returnPath: window.location.href
          }
        },
        false
      )
        .then(response => {
          window.location.href = response;
          // console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    ...mapGetters(["getIsAdmin"]),
    ...mapState(["userInformation"]),
    hasGcal() {
      return "gcalToken" in this.userInformation;
    },
    renderCreateEventButton() {
      let render = {
        text: "Create request",
        icon: "el-icon-question"
      };

      if (this.getIsAdmin) {
        render.text = "Event Management";
        render.icon = "el-icon-date";
      }

      return render;
    },

    buttons() {
      let buttons = [
        {
          label: this.renderCreateEventButton.text,
          round: true,
          plain: true,
          type: "primary",
          method: () => {
            console.log("Clicked");
            this.UPDATE_DIALOG_INDEX({
              dialog: "eventManager",
              view: true
            });
          },
          icon: this.renderCreateEventButton.icon
        }
      ];
      return buttons;
    }
  }
};
</script>

<style></style>
