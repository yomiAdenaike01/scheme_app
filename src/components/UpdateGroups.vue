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
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

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
      return this.clientInformation[this.groupType];
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

    groupLen() {
      return this.clientGroup.length;
    },
    isAdminFormItem() {
      return {
        component_type: "checkbox",
        model: "is_admin",
        label: "Has admin privilages",
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
          form: this.createGroupForm
        }
      };
    },
    editGroupForm() {
      let form = [
        {
          component_type: "select",
          label: `Select ${this.langXref.label} group`,
          required: true,
          options: this.groups,
          model: "groupID"
        }
      ];

      if (this.groupData?.groupID) {
        form.push({
          component_type: "text",
          label: "Group name",
          model: "label",
          noLabel: true
        });

        if (this.groupType == "event_groups") {
          form.push({
            component_type: "select",
            label: "Enable group for",
            options: this.clientInformation.user_groups,
            multiple: true,
            noLabel: true,
            model: "enabled_for"
          });
        } else {
          form.push(this.isAdminFormItem, {
            component_type: "checkbox",
            model: "enable_event_rejection",
            label: "Enable event rejection"
          });
        }
      }
      return form;
    },
    createGroupForm() {
      let createForm = [];

      let newGroupName = {
        component_type: "text",
        noLabel: true,
        model: "label",
        label: `Select ${this.langXref.label} group`
      };

      if (this.groupType == "user_groups") {
        createForm.push(newGroupName, this.isAdminFormItem, {
          component_type: "checkbox",
          noLabel: true,
          label: "Reject event privilages",
          model: "enable_event_rejection",

          hint:
            "Events that user's assigned to will not be approved until they have approved it also."
        });
      } else {
        createForm.push(newGroupName, {
          component_type: "select",
          label: `Enable group for the following user groups`,
          noLabel: true,
          options: this.clientInformation.user_groups,
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

          form: [
            {
              component_type: "select",
              label: `Select ${this.langXref.label} group`,
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
    },
    groupLabelXref() {
      let obj = {
        user_groups: "user_group",
        event_groups: "event_group"
      };
      return obj[this.groupType];
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
    ...mapActions(["request"]),
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
      // View the users in that user group
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
    async handleRequest() {
      try {
        let apiPayload = this.payload;
        apiPayload.data._id = this.groupData.groupID;

        await this.request(apiPayload);

        await this.$confirm(
          "Group change detected. Please restart to view the changes",
          "Warning",
          {
            confirmButtonText: "Restart",
            type: "info",
            showCancelButton: false,
            showClose: false,
            closeOnClickModal: false,
            callback: () => {
              window.location.reload();
            }
          }
        );

        this.$emit("close");
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
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
