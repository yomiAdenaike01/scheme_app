<template>
  <div class="event_group_management_container">
    <div class="buttons_container">
      <s-button
        v-for="(button, index) in config"
        :key="index"
        :class="{
          active: button.toLowerCase() == selectedConfig.toLowerCase()
        }"
        flat
        @click="changeContent(button)"
      >
        {{ `${button} group` }}
      </s-button>
    </div>
    <div v-if="displayContent" class="group_management_container">
      <Form
        :config="form"
        emit-on-change
        all-optional
        :submit-button="{ text: `${selectedConfig} group` }"
        @change="groupData = $event"
        @val="handleRequest"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
import Form from "@/components/Form";
export default {
  name: "UpdateGroups",
  components: {
    Form,
    SButton: () => import("@/components/SButton")
  },
  props: {
    groupType: {
      type: String,
      default: "event_groups"
    }
  },
  data() {
    return {
      selectedConfig: "",
      groupData: {},
      displayContent: false
    };
  },
  computed: {
    ...mapState(["clientInformation", "rootGroupRef"]),
    ...mapState("Admin", ["team", "groupRef"]),
    ...mapGetters("Admin", ["getUserGroups"]),
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
      let arr = [];
      for (
        let i = 0, len = this.clientInformation?.[this.groupType].length;
        i < len;
        i++
      ) {
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
      let modGroups = [...this.clientInformation[this.groupType]];
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
      return this.clientInformation[this.groupType].find(group => {
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
      return this.clientInformation[this.groupType].findIndex(index => {
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
      return this.clientInformation[this.groupType].length;
    },
    isAdminFormItem() {
      return {
        "component-type": "switch",
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
          mutation: () => {
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
                console.log(member);
                this.UPDATE_TEAM_MEMBER_GROUP({
                  index: i,
                  groupType: groupLabel,
                  payload: update
                });
              }
            }
          },
          catch: () => {
            this.UPDATE_GROUP(this.rootGroupRef);
          },
          form: (function(vm) {
            let form = [
              {
                "component-type": "select",
                placeholder: `Select ${vm.langXref.label} group`,
                required: true,
                options: vm.groups,
                model: "groupID"
              }
            ];
            if (vm.groupData?.groupID) {
              form.push({
                "component-type": "text",
                placeholder: "Change name",
                model: "label"
              });
              if (vm.groupType == "event_groups") {
                form.push({
                  "component-type": "select",
                  placeholder: "Enable group for",
                  options: vm.modGroups,
                  multiple: true,
                  model: "enabled_for",
                  hint: `Already enabled for the following ${vm.langXref.pluralize()} <strong>${
                    vm.usersText
                  }</strong>`
                });
              } else {
                form.push(vm.isAdminFormItem, {
                  "component-type": "switch",
                  model: "enable_event_rejection",
                  placeholder: "Enable event rejection",
                  noLabel: true
                });
              }
            }
            return form;
          })(this)
        }
      };
    },

    createGroup() {
      return {
        Create: {
          request: {
            method: "POST",
            data: this.groupLen
          },
          mutation: () => {
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
                _id: Math.random()
                  .toString(16)
                  .slice(2)
              }
            });
          },
          form: (function(vm) {
            let createForm = [];
            let newGroupName = {
              "component-type": "text",
              placeholder: `${vm.langXref.capitalize()} group name`,
              required: true,
              model: "label"
            };
            if (vm.groupType == "user_groups") {
              createForm.push(newGroupName, vm.isAdminFormItem, {
                "component-type": "switch",
                noLabel: true,
                placeholder: "Reject event privilages",
                model: "enable_event_rejection",
                hint:
                  "Events that user's assigned to will not be approved until they have approved it also."
              });
            } else {
              createForm.push(newGroupName, {
                "component-type": "select",
                placeholder: `Enable group for user groups`,
                required: true,
                options: vm.getUserGroups,
                model: "enabled_for",
                multiple: true
              });
            }

            return createForm;
          })(this)
        }
      };
    },
    deleteGroup() {
      return {
        Delete: {
          request: {
            method: "DELETE"
          },
          catch: () => {
            this.CREATE_GROUP(this.rootGroupRef);
            if (this.groupType == "user_groups") {
              this.REASSIGN_ELEMENTS(this.rootGroupRef);
            } else {
              this.REASSIGN_ELEMENTS({
                assignment: "events",
                ...this.rootGroupRef
              });
            }
          },
          mutation: () => {
            this.genPromptBox({
              boxType: "confirm",
              title: "Confirm",
              text: `${this.langXref.capitalize()} that are assigned to this group will be moved to an unassigned category`,
              confirm: "Yes"
            }).then(() => {
              let payload = this.defaultMutationPayload;
              this.DELETE_GROUP(payload);
              payload.group = this.clientInformation[payload.groupType][
                payload.groupIndex
              ];
              if (this.groupType == "user_groups") {
                this.REASSIGN_ELEMENTS(payload);
              } else {
                this.REASSIGN_ELEMENTS({
                  assignment: "events",
                  ...payload
                });
              }
            });
          },

          form: [
            {
              "component-type": "select",
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
      let formData = { ...this.groupData };
      formData._id = formData.groupID;
      delete formData.groupID;
      let url = "clients/group",
        data = { ...formData, groupType: this.groupType };

      let payloadXref = {
        ...this.createGroup,
        ...this.editGroup,
        ...this.deleteGroup
      };
      payloadXref[this.selectedConfig].request = {
        ...payloadXref[this.selectedConfig].request,
        data: { ...data, ...payloadXref[this.selectedConfig].request?.data },
        url
      };
      return payloadXref[this.selectedConfig];
    },
    payload() {
      return this.groupConfig.request;
    },

    form() {
      return this.groupConfig.form;
    },
    config() {
      let arr = ["Create"];
      if (this.clientInformation[this.groupType].length > 0) {
        arr.push("Delete", "Edit");
      }
      return arr;
    }
  },
  destroyed() {
    this.destroyComponent();
  },

  deactivated() {
    this.destroyComponent();
  },

  methods: {
    ...mapActions(["request", "genPromptBox"]),
    ...mapMutations(["CREATE_GROUP", "UPDATE_GROUP", "DELETE_GROUP"]),
    ...mapMutations("Admin", [
      "CLEAR_BREADCRUMBS",
      "REASSIGN_ELEMENTS",
      "UPDATE_TEAM_MEMBER_GROUP"
    ]),
    changeContent(button) {
      this.selectedConfig = button;
      this.displayContent = true;
      this.groupData = {};
    },
    destroyComponent() {
      this.groupData = {};
      this.displayContent = false;
      this.selectedConfig = "";
    },
    handleRequest() {
      this.groupConfig?.mutation();
      this.request(this.payload)
        .then(response => {
          if (this.selectedConfig.toLowerCase() == "create") {
            this.UPDATE_GROUP({
              groupIndex: this.clientInformation[this.groupType].length - 1,
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
.group_management_container {
  padding: 20px;
}
</style>
