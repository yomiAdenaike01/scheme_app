<template>
  <Overlay :display="displayOverlay" @close="closeOverlay">
    <div class="team_overlay">
      <div class="navigation_container">
        <strong class="capitalize"> {{ makePretty(langXref[view]) }}</strong>
        <i
          :class="
            `bx bx-${
              view == 'create_group' ? 'left' : 'right'
            }-arrow-alt trigger`
          "
          @click="updateView"
        ></i>
      </div>

      <Form
        v-if="view == 'create_user'"
        v-model="inputtedTeamMemberData"
        :headings="headings"
        all-optional
        :config="teamMemberFormConfig"
        :submit-button="{
          text: mode == 'update' ? 'Update team member' : 'Create team member'
        }"
        @val="$emit('handleTeamMember', inputtedTeamMemberData)"
      >
        <div slot="header" class="text_container">
          <UpdateView
            v-if="Object.values(inputtedTeamMemberData).length > 0"
            :mode="mode"
            :user-group="userGroupXref"
            :inputs="inputtedTeamMemberData"
          />
          <div v-else class="profile_view all_centre">
            <h1>Profile view</h1>
          </div>
        </div>
      </Form>

      <UpdateGroups v-else group-type="user_groups" />
    </div>
  </Overlay>
</template>

<script>
import { mapGetters } from "vuex";
import Avatar from "@/components/Avatar";
import Overlay from "@/components/Overlay";
import Form from "@/components/Form";
import UpdateGroups from "@/components/UpdateGroups";
import UpdateView from "./UpdateView";
import { SlideYUpTransition } from "vue2-transitions";

export default {
  components: {
    Overlay,
    Form,
    SlideYUpTransition,
    Avatar,
    UpdateGroups,
    UpdateView
  },
  props: {
    mode: {
      type: String,
      default: "create"
    },

    selectedTeamMember: {
      type: Object,
      default: () => {
        return {};
      }
    },
    displayOverlay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputtedTeamMemberData: {},
      view: "create_user"
    };
  },
  computed: {
    ...mapGetters(["getUserGroups"]),

    langXref() {
      return {
        create_group: "manage groups",
        create_user: "create new user"
      };
    },

    userGroupXref() {
      return this.getUserGroups.find(group => {
        return group.value == this.inputtedTeamMemberData.user_group;
      })?.label;
    },
    headings() {
      return {
        name: `
        <h3>Personal information</h3>
        `,
        phoneNumber: `
        <h3>Contact information</h3>
        `,

        user_group: `<h3>Misc information</h3/>`
      };
    },
    teamMemberFormConfig() {
      return [
        {
          component_type: "text",
          model: "name",
          placeholder: "First and lastname"
        },

        {
          component_type: "text",
          model: "phoneNumber",
          placeholder: "Phone number"
        },
        {
          component_type: "text",
          model: "email",
          placeholder: "Email address"
        },
        {
          model: "user_group",
          component_type: "select",
          options: this.getUserGroups,
          placeholder: "Assign to user group"
        },
        {
          component_type: "textarea",
          model: "notes",
          placeholder: "Notes"
        }
      ];
    }
  },
  watch: {
    mode: {
      immediate: true,
      handler() {
        this.load();
      }
    },
    selectedTeamMember() {
      this.load();
    }
  },

  methods: {
    load() {
      let val = this.mode;
      const properties = ["name", "email", "user_group", "notes"];
      const extensions = {
        user_group: "_id"
      };
      const teamMember = Object.assign({}, this.selectedTeamMember);

      if (val == "update") {
        let formattedMember = {};

        for (let i = 0, len = properties.length; i < len; i++) {
          let property = properties[i];

          if (extensions[property]) {
            let extension = extensions[property];
            formattedMember[property] = teamMember[property][extension];
          } else {
            formattedMember[property] = teamMember[property];
          }
        }
        this.inputtedTeamMemberData = Object.assign({}, formattedMember);
      } else {
        this.inputtedTeamMemberData = {};
      }
    },
    updateTeamMemberObject(e) {
      this.inputtedTeamMemberData = e;
    },

    updateView() {
      if (this.view == "create_user") {
        this.view = "create_group";
      } else {
        this.view = "create_user";
      }
    },

    closeOverlay(clearSearch) {
      this.$emit("close");
      this.inputtedTeamMemberData = {};
      if (clearSearch) {
        this.$emit("clearSearch");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.navigation_container {
  background: rgb(250, 250, 250);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-size: 1.2em;
  margin-bottom: 10px;
}
.team_overlay {
  display: flex;
  flex-direction: column;
  &/deep/ .text_display_container .headings_wrapper {
    padding-bottom: 0;
  }
}
p {
  margin: 0;
}
.team_overlay_body {
  padding: 10px;
}
.text_display_header {
  margin-top: 30px;
}
.user_info_item {
  margin: 0;
  &:first-of-type {
    margin-top: 10px;
  }
}
.user_info_item.firstname {
  font-weight: bold;
  text-transform: capitalize;
  margin-bottom: 5px;
}
.selected_user_avatar {
  margin: 0 40px;
}
.edit_user_wrapper {
  display: flex;
  padding: 10px;
  > * {
    flex: 1;
  }
}
.name_item,
.notes_item {
  margin-top: 10px;
}
.name_item {
  font-size: 1.3em;
  margin-bottom: 5px;
}
.text_container {
  padding: 20px;
  .profile_view {
    border: 3px dashed rgb(220, 220, 220);
    padding: inherit;
    color: rgb(220, 220, 220);

    display: flex;
    justify-content: center;
  }
}
</style>
