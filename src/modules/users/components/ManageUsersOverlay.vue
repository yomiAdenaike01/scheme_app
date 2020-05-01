<template>
  <Overlay v-model="view" :display="view">
    <Tabs v-model.number="currentTab" :tabs="tabs" @val="userModuleController">
      <div slot="header">
        <TextDisplay
          :display-text="{
            heading: 'Manage Users',
            content: 'Manage all users and groups here.'
          }"
          mode="title"
        />
      </div>
    </Tabs>
  </Overlay>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";

import Tabs from "@/components/Tabs";
import TextDisplay from "@/components/TextDisplay";
import UpdateGroups from "@/components/UpdateGroups";
import Overlay from "@/components/Overlay";
export default {
  name: "UserOverlay",
  components: {
    TextDisplay,
    Tabs,
    UpdateGroups,
    Overlay
  },

  props: {
    display: Boolean
  },

  data() {
    return {
      currentTab: 0,
      convertedData: {},
      createUserForm: {}
    };
  },
  computed: {
    ...mapState(["clientInformation", "teamRef", "team"]),
    ...mapGetters(["getUserGroups"]),

    genPwd() {
      return this.createUserForm.name
        .trim()
        .toLowerCase()
        .replace(/\s/g, "");
    },

    tabs() {
      return [
        {
          label: "Manage user groups",
          view: {
            component: UpdateGroups,
            props: { groupType: "user_groups" }
          }
        },
        {
          label: "Create users",
          formContent: this.formItems
        }
      ];
    },

    formItems() {
      return [
        {
          name: "name",
          "component-type": "text",
          clearable: true,
          placeholder: "Name",
          model: "name"
        },
        {
          name: "gender",
          placeholder: "Gender",
          model: "gender",
          "component-type": "select",
          options: [
            {
              value: "male",
              name: "Male"
            },
            {
              value: "female",
              name: "Female"
            },
            {
              value: "other",
              name: "Other"
            }
          ]
        },

        {
          name: "email",
          "component-type": "text",
          model: "email",
          clearable: true,
          placeholder: "Email"
        },
        {
          name: "phone_number",
          "component-type": "text",
          model: "phone_number",
          clearable: true,
          placeholder: "Phone Number"
        },
        {
          placeholder: "Group",
          model: "user_group",
          "component-type": "select",
          clearable: true,
          options: this.getUserGroups
        }
      ];
    },

    view: {
      get() {
        return this.display;
      },
      set(val) {
        this.$emit("close", val);
      }
    }
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations([
      "DELETE_TEAM_MEMBER",
      "ADD_TEAM_MEMBER",
      "UPDATE_ONE_TEAM_MEMBER",
      "UPDATE_SYSTEM_NOTIFICATION"
    ]),
    updateNewUser(response) {
      this.UPDATE_ONE_TEAM_MEMBER({
        index: this.team.length - 1,
        payload: response
      });
      this.view = false;
    },
    userModuleController(val) {
      switch (this.currentTab) {
        case 1: {
          this.createOneUser(val);
          break;
        }
        default: {
          break;
        }
      }
    },

    createOneUser(employee) {
      let uGroup = this.clientInformation.user_groups.find(group => {
        return group._id == employee.user_group;
      });
      let _employee = { ...employee, user_group: uGroup };

      this.ADD_TEAM_MEMBER(_employee);
      this.request({
        method: "POST",
        url: "users/register/one",
        data: {
          ...employee,
          client_id: this.clientInformation._id,
          admin_gen: true
        }
      })
        .then(response => {
          this.updateNewUser(response);
        })
        .catch(() => {
          this.DELETE_USER(this.teamRef?.index);
        });
    }
  }
};
</script>
