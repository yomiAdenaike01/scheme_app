<template>
  <div class="event_group_management_container">
    <div class="buttons_container">
      <s-button
        v-for="(button, index) in config"
        :key="index"
        class="rounded flat"
        :class="{
          active: button.toLowerCase() == selectedConfig.toLowerCase()
        }"
        @click="changeContent(button)"
      >
        {{ `${button} group` }}
      </s-button>
    </div>

    <div v-if="displayContent" class="group_management_container">
      <Form
        v-model="groupData"
        :config="form"
        all-optional
        :submit-button="{ text: `${selectedConfig} group` }"
        :headings="headings"
        @val="handleRequest"
      >
        <ColourPicker
          v-if="groupType == 'event_groups' && selectedConfig == 'Create'"
          slot="footer"
          v-model="groupData.colour"
          display-details
        />
      </Form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import genID from "@/mixins/genID";

import Form from "@/components/Form";
export default {
  name: "UpdateGroups",
  components: {
    Form,
    SButton: () => import("@/components/SButton"),
    ColourPicker: () => import("@/components/ColourPicker")
  },
  mixins: [genID],
  props: {
    groupType: {
      type: String,
      default: "event_groups"
    }
  },
  data() {
    return {
      selectedConfig: "Create",
      groupData: {},
      displayContent: true
    };
  },
  computed: {
    ...mapState(["clientInformation", "rootGroupRef"]),
    ...mapState(["groupRef"]),
    ...mapState("Team", ["team"]),
    headings() {
      return {
        label: "<h3>Group Information</h3>"
      };
    },
    langXref() {
      let lang = {
        event_groups: {
          label: "event"
        },
        user_groups: {
          label: "user"
        }
      };
      lang[this.groupType].capitalize = function() {
        this.label = `${this.label.charAt(0).toUpperCase()}${this.label.slice(
          1
        )}`;
        return this.label;
      };
      lang[this.groupType].pluralize = function(possession = false) {
        this.label = !possession ? `${this.label}s` : `${this.label}'s`;
        return this.label;
      };
      return lang[this.groupType];
    },

    groups() {
      let arr = [],
        len = this.clientInformation?.[this.groupType].length;

      for (let i = 0; i < len; i++) {
        let group = this.clientInformation?.[this.groupType][i];

        if (this.groupType == "user_groups" && group?.groupID == 0) {
          continue;
        } else {
          arr.push({ label: group.label, value: group._id });
        }
      }

      return arr;
    },
    modGroups() {
      let modGroups = [...this.clientGroup];

      let allUsersIndex = modGroups.findIndex(group => {
        return group.label.toLowerCase() == "system administrator";
      });

      modGroups.splice(allUsersIndex, 1, {
        label: "All team members",
        groupID: 0
      });

      return modGroups;
    },
    enabledFor() {
      return this.clientGroup.find(group => {
        return this.groupData.groupID == group.groupID;
      })?.enabled_for;
    },
    usersInGroup() {
      let users = [];

      if (this.enabledFor) {
        users = this.team.map(({ name, _id }) => {
          return { name, _id };
        });
      } else {
        users = this.team.filter(teamMember => {
          return this.enabledFor?.indexOf(teamMember.groupID) > -1;
        });
      }
      return users;
    },
    usersText() {
      let textContent = "";

      if (this.groupData?.[this.groupType] == 0) {
        textContent = `All ${this.langXref.pluralize()}`;
      } else {
        textContent = this.usersInGroup.map(user => user.name).join(",");
      }
      return textContent;
    },
    defaultMutationPayload() {
      return {
        groupIndex: this.groupIndex,
        groupType: this.groupType
      };
    },
    groupIndex() {
      return this.clientGroup.findIndex(index => {
        return index._id == this.groupData.groupID;
      });
    },
    mutationPayloads() {
      let config = ["Create", "Edit"];
      return {
        [config.indexOf(this.selectedConfig) > -1]: {
          label: this.groupData?.label,
          groupID: this.groupData?.groupID
        }
      };
    },
    groupLen() {
      return this.clientGroup.length;
    },
    isAdminFormItem() {
      return {
        component_type: "checkbox",
        model: "is_admin",
        placeholder: "Has admin privilages",
        noLabel: true
      };
    },
    editGroup() {
      let { groupID, ...update } = this.groupData;
      return {
        Edit: {
          request: {
            method: "PUT",
            data: { update }
          },
          mutation: () => this.handleUpdateGroup(update),
          catch: () => {
            this.UPDATE_GROUP(this.rootGroupRef);
          },

          form: this.editGroupForm
        }
      };
    },

    createGroup() {
      return {
        Create: {
          request: {
            method: "POST",
            data: this.groupData
          },
          mutation: this.handleCreateGroup,
          form: this.createGroupForm
        }
      };
    },
    editGroupForm() {
      let form = [
        {
          component_type: "select",
          placeholder: `Select ${this.langXref.label} group`,
          required: true,
          options: this.groups,
          model: "groupID"
        }
      ];

      if (this.groupData?.groupID) {
        form.push({
          component_type: "text",
          placeholder: "Group name",
          model: "label",
          noLabel: true
        });

        if (this.groupType == "event_groups") {
          form.push({
            component_type: "select",
            placeholder: "Enable group for",
            options: this.modGroups,
            multiple: true,
            noLabel: true,
            model: "enabled_for",
            hint: `Already enabled for the following ${this.langXref.pluralize()} <strong>${
              this.usersText
            }</strong>`
          });
        } else {
          form.push(this.isAdminFormItem, {
            component_type: "checkbox",
            model: "enable_event_rejection",
            placeholder: "Enable event rejection",
            noLabel: true
          });
        }
      }
      return form;
    },
    createGroupForm() {
      let createForm = [];

      let newGroupName = {
        component_type: "text",
        placeholder: `${this.langXref.capitalize()} group name`,
        required: true,
        noLabel: true,
        model: "label"
      };

      if (this.groupType == "user_groups") {
        createForm.push(newGroupName, this.isAdminFormItem, {
          component_type: "checkbox",
          noLabel: true,
          placeholder: "Reject event privilages",
          model: "enable_event_rejection",

          hint:
            "Events that user's assigned to will not be approved until they have approved it also."
        });
      } else {
        createForm.push(newGroupName, {
          component_type: "select",
          placeholder: `Enable group for user groups`,
          required: true,
          noLabel: true,
          options: this.getUserGroups,
          model: "enabled_for",
          multiple: true
        });
      }

      return createForm;
    },
    uGroups() {
      return this.getUserGroups;
    },
    deleteGroup() {
      return {
        Delete: {
          request: {
            method: "DELETE",
            data: this.groupData._id
          },

          catch: () => {
            this.CREATE_GROUP(this.rootGroupRef);

            if (this.groupType == "user_groups") {
              this.REASSIGN_TEAM_MEMBERS(this.rootGroupRef);
            } else {
              this.REASSIGN_TEAM_MEMBERS({
                assignment: "events",
                ...this.rootGroupRef
              });
            }
          },

          mutation: this.handleDeleteGroup,

          form: [
            {
              component_type: "select",
              placeholder: `Select ${this.langXref.label} group`,
              required: true,
              options: this.groups,
              model: "groupID"
            }
          ]
        }
      };
    },
    mutationData() {
      return {
        ...this.defaultMutationPayload,
        payload: this.mutationPayloads[true]
      };
    },
    groupConfig() {
      let payloadXref = {
        ...this.createGroup,
        ...this.editGroup,
        ...this.deleteGroup
      };

      let computedConfig = payloadXref[this.selectedConfig];

      computedConfig.request = Object.assign(computedConfig.request, {
        url: "clients/group",
        data: Object.assign({}, computedConfig.request.data, {
          groupType: this.groupType
        })
      });

      return computedConfig;
    },
    payload() {
      return this.groupConfig.request;
    },
    clientGroup() {
      return this.clientInformation[this.groupType];
    },
    form() {
      return this.groupConfig.form;
    },
    config() {
      let arr = ["Create"];
      if (this.clientGroup.length > 0) {
        arr.push("Delete", "Edit");
      }
      return arr;
    }
  },
  watch: {
    "groupData.groupID"(val) {
      if (this.selectedConfig == "Edit") {
        if (this.groupData?.groupID) {
          this.loadClientGroupData(val);
        }
      }
    }
  },
  destroyed() {
    this.clearData();
  },

  deactivated() {
    this.clearData();
  },
  methods: {
    ...mapActions(["request", "genPromptBox"]),
    ...mapMutations("Team", [
      "UPDATE_TEAM_MEMBER_GROUP",
      "REASSIGN_TEAM_MEMBERS"
    ]),
    ...mapMutations(["CREATE_GROUP", "UPDATE_GROUP", "DELETE_GROUP"]),
    loadClientGroupData(id) {
      let { enable_event_rejection, is_admin } = this.clientGroup.find(
        group => {
          return group._id == id;
        }
      );

      this.$set(
        this.groupData,
        "enable_event_rejection",
        enable_event_rejection
      );

      this.$set(this.groupData, "is_admin", is_admin);
    },
    handleUpdateGroup(update) {
      this.UPDATE_GROUP({
        groupType: this.groupType,
        groupIndex: this.groupIndex,
        payload: this.groupData
      });

      let groupLabel =
        this.groupType == "user_groups" ? "user_group" : "event_group";

      for (let i = 0, len = this.team.length; i < len; i++) {
        let member = this.team[i];

        if (member[groupLabel]._id == this.groupData.groupID) {
          this.UPDATE_TEAM_MEMBER_GROUP({
            index: i,
            groupType: groupLabel,
            payload: update
          });
        }
      }
    },
    async handleDeleteGroup() {
      await this.genPromptBox({
        boxType: "confirm",
        title: "Confirm",
        text: `${this.langXref.capitalize()} that are assigned to this group will be moved to an unassigned category`,
        confirm: "Yes"
      });

      let payload = this.defaultMutationPayload;
      this.DELETE_GROUP(payload);

      payload.group = this.clientInformation[payload.groupType][
        payload.groupIndex
      ];

      if (this.groupType == "user_groups") {
        this.REASSIGN_TEAM_MEMBERS(payload);
      } else {
        this.REASSIGN_TEAM_MEMBERS({
          assignment: "events",
          ...payload
        });
      }
    },
    handleCreateGroup() {
      let payload = {
        label: this.groupData.label
      };

      if (this.groupType == "user_groups") {
        payload.groupID = this.groupLen;
      } else {
        payload.enabled_for = this.getUserGroups;
      }

      this.CREATE_GROUP({
        groupType: this.groupType,
        payload: {
          ...this.groupData,
          _id: this.genID()
        }
      });
    },
    changeContent(button) {
      this.selectedConfig = button;
      this.displayContent = true;
      this.groupData = {};
    },
    updateGroupData(data) {
      for (let property in data) {
        if (this.groupData[property] != data[property]) {
          this.$set(this.groupData, property, data[property]);
        }
      }
    },
    clearData() {
      this.groupData = {};
      this.displayContent = false;
      this.selectedConfig = "";
    },
    handleRequest() {
      let payload = Object.assign({}, this.payload);

      this.groupConfig.mutation();
      return;
      this.request(payload)
        .then(response => {
          if (this.selectedConfig.toLowerCase() == "create") {
            this.UPDATE_GROUP({
              groupIndex: this.clientGroup.length - 1,
              groupType: this.groupType,
              payload: response
            });
          }

          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.groupConfig?.catch();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.buttons_container {
  display: flex;
  justify-content: center;
  align-items: center;
  &/deep/ .button_container {
    margin: 10px;
  }
}
</style>
