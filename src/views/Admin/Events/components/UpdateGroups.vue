<template>
  <div class="event_group_management_container">
    <div class="buttons_container">
      <el-button
        v-for="(button, index) in config"
        :key="index"
        :type="selectedConfig == button ? 'primary' : 'plain'"
        @click="changeContent(button)"
      >
        {{ `${button} group` }}
      </el-button>
    </div>
    <el-collapse-transition>
      <div v-if="displayContent" class="group_management_container">
        <Form
          :config="form"
          all-optional
          :submit-button="{ text: `${selectedConfig} group` }"
          @val="handleRequest"
        />
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import Form from "@/components/Form";
export default {
  name: "UpdateGroups",
  components: {
    Form
  },
  props: {
    groupType: {
      type: String,
      default: "eventGroups"
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
    ...mapState("Admin", ["teamInformation", "groupRef"]),
    langXref() {
      let lang = {
        eventGroups: {
          label: "event"
        },
        userGroups: {
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
        if (this.groupType == "userGroups" && group?.groupID == 0) {
          continue;
        } else {
          arr.push({ label: group.label, value: group.groupID });
        }
      }
      return arr;
    },
    modGroups() {
      let modGroups = [...this.clientInformation[this.groupType]];
      let allUsersIndex = modGroups.findIndex(group => {
        return group.groupID == 0;
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
      })?.enabledFor;
    },
    usersInGroup() {
      let users = [];
      if (this.enabledFor) {
        users = this.teamInformation.map(({ name, _id }) => {
          return { name, _id };
        });
      } else {
        users = this.teamInformation.filter(teamMember => {
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
        return index.groupID == this.groupData.groupID;
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
    groupConfig() {
      let url = "clients/group",
        data = { ...this.groupData, groupType: this.groupType },
        mutationData = {
          ...this.defaultMutationPayload,
          payload: this.mutationPayloads[true]
        };
      let payloadXref = {
        Create: {
          request: {
            method: "POST",
            data: this.groupLen
          },
          mutation: () => {
            let payload = {
              label: this.groupData.label
            };
            if (this.groupType == "userGroups") {
              payload.groupID = this.groupLen;
            } else {
              payload.enabledFor = this.groupData.enabledFor;
            }
            this.CREATE_GROUP({
              groupType: this.groupType,
              payload: { label: this.groupData.label, groupID: this.groupLen }
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
            if (vm.groupType == "userGroups") {
              createForm.push(newGroupName);
            } else {
              createForm.push(newGroupName, {
                "component-type": "select",
                placeholder: `Enable group for`,
                required: true,
                options: vm.groups,
                model: "enabledFor",
                multiple: true
              });
            }

            return createForm;
          })(this)
        },
        Edit: {
          request: {
            method: "PUT"
          },
          mutation: () => {
            console.log(mutationData);
            this.UPDATE_GROUP(mutationData);
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
                placeholder: "Name",
                model: "label"
              });
              if (vm.groupType == "eventGroups") {
                form.push({
                  "component-type": "select",
                  placeholder: "Enable group for",
                  options: vm.modGroups,
                  multiple: true,
                  model: "enabledFor",
                  hint: `Already enabled for the following ${vm.langXref.pluralize()} <strong>${
                    vm.usersText
                  }</strong>`
                });
              }
            }
            return form;
          })(this)
        },
        Delete: {
          request: {
            method: "DELETE"
          },
          catch: () => {
            this.CREATE_GROUP(this.rootGroupRef);
            if (this.groupType == "userGroups") {
              this.REASSIGN_ELEMENTS(this.rootGroupRef);
            } else {
              this.REASSIGN_ELEMENTS({
                assignment: "eventsInformation",
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
              if (this.groupType == "userGroups") {
                this.REASSIGN_ELEMENTS(payload);
              } else {
                this.REASSIGN_ELEMENTS({
                  assignment: "eventsInformation",
                  ...payload
                });
              }
            });
          },

          form: [
            {
              "component-type": "select",
              placeholder: "Select event group",
              required: true,
              options: this.groups,
              model: "groupID"
            }
          ]
        }
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
      if (this.clientInformation.eventGroups.length > 0) {
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
    ...mapMutations("Admin", ["CLEAR_BREADCRUMBS", "REASSIGN_ELEMENTS"]),
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
    handleRequest(e) {
      this.groupData = e;
      this.groupConfig?.mutation();
      this.request(this.payload)
        .then(() => {
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
  &/deep/ .el-button {
    font-size: 1.5em;
  }
}
.group_management_container {
  padding: 20px;
}
</style>
