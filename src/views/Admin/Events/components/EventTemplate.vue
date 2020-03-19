<template>
    
  <div
    class="event_template_container p-4"
    v-loading="loading"
    @click="displayDetails = !displayDetails"
  >
    <div class="template_title_container flex flex--space-between align-center">
     <h3 class="capitalize mr-3">{{ data.name }}</h3>
      <div class="button_container">
        <!-- <Popover trigger='click'>
        <el-button plain type='primary' round size='mini' slot='trigger' @click="$event.stopPropagation()">Update</el-button>
        <Form submitText='update' slot='content' @val='updateTemplate' :config="updateTemplateConfig"/>
        </Popover> -->
        <el-button round type='danger' size='mini'  @click="deleteTemplate">Delete</el-button>
      </div>
    </div>
    <el-collapse-transition>
      <div v-if="displayDetails" class="mt-3">
        <h3><strong>Details</strong></h3>
        {{ getEventAssignedTo(data.content.assignedTo).text }}
        <p>Event Type: {{ getGroupName("event", data.content.type).name }}</p>
        <span>Start Date: </span>{{ formatDate(data.content.startDate) }}
        <br />
        <span>End Date: </span>{{ formatDate(data.content.endDate) }}
        <br />
        <br />
        <h3><strong>Repeat on</strong></h3>
        {{ formattedWeekdays }}
        <br />
        <el-button
          class="w-100 mt-3"
          @click="applyTemplate"
          plain
          type="primary"
          >Apply</el-button
        >
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Popover from '@/components/Popover';
import Form from '@/components/Form'
export default {
  name: "EventTemplate",
  data() {
    return {
      loading: false,
      displayDetails: false
    };
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components:{
    Popover,
    Form
  },
  computed: {
    ...mapGetters("Admin", ["getGroupName",'getDropdownTeamMembers', "getEventAssignedTo",'getEnabledEvents']),
    ...mapState(["daysOfWeek"]),
    updateTemplateConfig(){
      return[
        {
          'component-type':'text',
          placeholder:'Template name',
          model:'name',
          optional:true

        },
       
     
        {
          'component-type':'select',
          placeholder:'Repeat for',
          options:this.daysOfWeek,
          model:'repeat',
          multiple:true,
          optional:true
        }
        ,
         {
          'component-type':'select',
          placeholder:'Event type',
          options: this.getEnabledEvents,
          model:'type',
          optional:true
        },
        {
          'component-type':'select',
          placeholder:'Assign event to users',
          options: this.getDropdownTeamMembers,
          model:'assingedTo',
          optional:true
        },
 {
          'component-type':'select',
          placeholder:'Assign event to user groups',
          options: this.getDropdownTeamMembers,
          model:'assingedTo',
          optional:true
        },
         {
          'component-type':'date-picker',
          'input-type':'date-time-range',
          start_placeholder:'Event start date time',
          end_placeholder:'Event end date time',
          model:'date',
          optional:true

        },
          {
          'component-type':'date-picker',
          'input-type':'date-time',
          placeholder:'Expire at',
          model:'until',
          optional:true

        },

      ]
    },
    content() {
      return this.data.content;
    },
    formattedWeekdays() {
      let _daysOfWeek = [...this.content.repeat.weekdays];
      return _daysOfWeek
        .map(days => {
          days = days - 1;
          return this.daysOfWeek[days].text;
        })
        .join(", ");
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapActions("Admin", ["createEvent", "getTemplates"]),
    /**
     * @name applyTemplate
     * @description Apply a template to the calendar
     */
    applyTemplate(e) {
      e.stopPropagation();
      // Create an event as many times as there is on the template
      this.loading = true;
      this.createEvent(this.data.content)
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @name updateTemplate
     * @description update a template
     */
    updateTemplate(templateInformation) {
      
     let update = {...templateInformation,...this.data};
    update.content = {
      ...this.data.content,
      type:templateInformation.type,
      
    }
     update.content.repeat = {
       weekdays: templateInformation.content.repeat.weekdays,
       ...this.data.content.repeat
     }
     delete templateInformation.date;
    return console.log(update);
    this.request({
        method: "PUT",
        url: "events/templates/update",
        data: { _id: this.data._id, update }
      })
        .then(response => {
          this.loading = false;
          this.getTemplates();
        })
        .catch(err => {
          this.loading = false;
          this.getTemplates();
        });
    },
    /**
     * 
     */
    deleteTemplate(e) {
      e.stopPropagation();

      this.request({
        method: "DELETE",
        url: "events/templates/delete",
        data: { _id: this.data._id }
      })
        .then(response => {
          this.loading = false;
          this.getTemplates();
          this.$emit("toggle", false);
        })
        .catch(err => {
          this.loading = false;
          this.getTemplates();
        });
    }
  },

};
</script>

<style lang="scss" scoped>
.template_title_container{
  cursor: pointer;
}
strong {
  font-weight: bold;
}
.event_template_container {
  border: 1px solid #efefef;
  border-radius: 10px;
}
.button_container > * {
  margin-right:10px;
}
</style>
