<template>
  <el-dialog :visible.sync="view">
    <el-row slot="title" type="flex">
      <el-col>
        <Title
          title="Details"
          subtitle="View and edit the details of the shift/event/request here."
          defaultClass="m-0"
        />
      </el-col>
      <el-col style="display:flex; justify-content:flex-end">
        <el-tag class="mt-4 mr-4" v-if="shift.is_pickup">Avaliable For Pickup</el-tag>
      </el-col>
    </el-row>

    <el-form>
      <el-form-item label="Assignee:">
        <p class="member_name">{{ shift.assigned_to }}</p>
      </el-form-item>
      <el-form-item label="Approved:">
        <el-button :icon="returnIcon" :type="returnApproval ? 'success' : 'warning'" circle></el-button>
        <el-button class="ml-3" v-if="!getIsAdmin">Resend Request</el-button>
      </el-form-item>
      <el-form-item label="Shift Type:">{{ shift.type }}</el-form-item>
      <el-divider>
        <span class="grey">Timing</span>
      </el-divider>
      <el-form-item label="Start Date Time:">
        <span>{{ shift.start }}</span>
      </el-form-item>
      <el-form-item label="End Date Time:">
        <span>{{ shift.end }}</span>
      </el-form-item>
      <el-row type="flex" :gutter="5">
        <el-col v-if="shift.is_pickup && shift.shift_type <= 2">
          <el-button style="width:100%" type="primary" plain @click="confirm('pickup')">Pickup</el-button>
        </el-col>
        <el-col v-if="!shift.is_pickup && shift.shift_type <= 2 && shift.assigned_to">
          <el-button style="width:100%" type="danger" plain @click="confirm('delete')">Drop</el-button>
        </el-col>
        <el-col v-if="getIsAdmin || currentUser._id == shift.assigned_to">
          <el-button style="width:100%" type="danger" @click="confirm('remove')">Delete</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import Title from "@/components/Title";

export default {
  name: "ViewShift",
  props: {
    shift: Object,
    display: Boolean
  },
  computed: {
    ...mapGetters(["getIsAdmin"]),
    ...mapState(["currentUser"]),
    canPickUp() {
      /**
       * Conditions:
       *  is yours
       *  can pick up (is not dropped)
       *  is admin
       *
       */
      let shift = this.shift;
      //   let isShiftYours = shift.assigned_to == this.currentUser._id
      //   let isDropped = shift.is_pickup
      //   let isAdmin = this.getIsAdmin
      let isShift = shift.is_pickup;
      if (shift.is_pickup) {
        return shift.is_pickup;
      } else if (this.getIsAdmin) {
        return true;
      }
      return isShift;
    },

    returnIcon() {
      let approved = this.returnApproval;
      let returnval;
      if (approved) {
        returnval = "el-icon-check";
      } else {
        returnval = "el-icon-close";
      }
      return returnval;
    },
    returnApproval() {
      return this.shift.is_approved.admin == 1;
    },
    view: {
      get() {
        return this.display;
      },
      set(val) {
        this.$emit("toggle", val);
      }
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),
    confirm(question) {
      switch (question) {
        case "remove":
          this.$confirm(
            `Are you sure you want to remove this event ?`,
            "Drop Event",
            {
              confirmButtonText: "Ok",
              cancelButtonText: "Cancel",
              type: "warning"
            }
          )
            .then(response => {
              this.deleteShift();
            })
            .catch(error => {
              return error;
            });
          break;
        case "delete":
          this.$confirm(
            `Are you sure you want to drop this event ?`,
            "Drop Event",
            {
              confirmButtonText: "Ok",
              cancelButtonText: "Cancel",
              type: "warning"
            }
          )
            .then(response => {
              this.updateShift({ assigned_to: "", is_pickup: true });
            })
            .catch(error => {
              return error;
            });
          break;
        case "pickup":
          this.$confirm(
            `Are you sure you want to pickup this event ?`,
            "Pickup Event",
            {
              confirmButtonText: "Ok",
              cancelButtonText: "Cancel",
              type: "warning"
            }
          )
            .then(response => {
              this.updateShift({
                is_pickup: false,
                assigned_to: this.currentUser._id
              });
            })
            .catch(error => {
              return error;
            });
          break;

        default:
          break;
      }
    },
    loadingToggle(val, loading) {
      this.$emit("loading", val);
      if (!loading) {
        this.$emit("toggle", val);
      }
    },
    deleteShift() {
      this.$emit("loading", true);
      this.request({
        method: "DELETE",
        url: "/shifts/delete",
        data: {
          id: this.shift.id
        }
      })
        .then(response => {
          this.$emit("loading", false);
          this.$emit("toggle", false);
          this.$emit("regetShifts", false);
        })
        .catch(error => {
          this.$emit("loading", false);
          this.$emit("toggle", false);

          return error;
        });
    },
    updateShift(update) {
      this.$emit("loading", true);
      this.request({
        method: "POST",
        url: "/shifts/update",
        data: {
          id: this.shift.id,
          update: update
        }
      })
        .then(response => {
          this.$emit("loading", false);
          this.$emit("toggle", false);
          this.$emit("regetShifts", false);

          this.UPDATE_NOTIFICATIONS({
            title: "Operation successful",
            message: "Shift successfully updated.",
            type: "success"
          });
        })
        .catch(error => {
          this.$emit("loading", false);
          this.$emit("regetShifts", false);
        });
    }
  },
  components: {
    Title
  }
};
</script>
