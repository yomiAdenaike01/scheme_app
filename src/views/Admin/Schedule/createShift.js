import moment from "moment";

export default {
  methods: {
    async getEmployeeID(name) {
      if (name.trim().toLowerCase() == this.getName) {
        return this.currentUser._id;
      } else if (!this.getIsAdmin) {
        return Promise.reject(
          "You cannot have other teammate names when you are not an admin"
        );
      } else {
        let foundTeamMember = this.team.find(member => {
          return member.name == name;
        });
        if (foundTeamMember) {
          return Promise.resolve(foundTeamMember._id);
        } else {
          return Promise.reject(
            "Could not find the ID of the team members please re-enter their names correctly"
          );
        }
      }
    },

    // Adds one week to the content
    addOneWeekData(data) {
      return data.map(elem => {
        return {
          ...elem,
          startDate: moment(
            moment(elem.startDate).add(1, "week")
          ).toISOString(),
          endDate: moment(moment(elem.endDate).add(1, "week")).toISOString()
        };
      });
    },

    async requestCreateScheduleTimesheet({ timesheet }) {
      // Add the timesheet content to the schedule
      try {
        await this.request({
          method: "POST",
          url: "shifts/timesheet",
          data: { timesheet }
        });
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // Submit one shift
    submitOneShift() {
      this.loading = true;
      let { date } = this.eventData;

      let startDate = moment(date[0]).toISOString();
      let endDate = moment(date[1]).toISOString();

      this.eventData = {
        ...this.eventData,
        startDate,
        endDate
      };
      this.request({
        method: "POST",
        url: "shifts/create",
        data: this.eventData
      })
        .then(response => {
          this.loading = false;
          this.UPDATE_NOTIFICATIONS({
            type: "success",
            message: "Shift successfully created"
          });
          return response;
        })
        .catch(error => {
          this.loading = false;
          return error;
        });
    },
    // Save template
    async requestSaveTemplate({ name, content }) {
      // Make request to save the template
      try {
        await this.request({
          method: "POST",
          url: "templates/create",
          data: { name, content }
        });
        this.view = false;
        this.resetData();
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * Submit with new timesheet
     */
    async submitWithTimeSheet() {
      this.loading = true;
      try {
        let { value } = await this.createMessagePrompt();
        let savedTemplate = await this.requestSaveTemplate({
          name: value,
          content: this.timeSheetData
        });
        if (savedTemplate) {
          await this.requestCreateScheduleTimesheet({
            timesheet: this.timeSheetData
          });
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.resetData();
        console.error("REQUEST ERRORS:", error);
      }
    },
    async createMessagePrompt() {
      try {
        let templateName = await this.$prompt("Save Template", {
          confirmButtonText: "Save timesheet as template",
          roundButton: true,
          inputPlaceholder: `schedule_created ${new Date()}`
        });
        return Promise.resolve(templateName);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
};
