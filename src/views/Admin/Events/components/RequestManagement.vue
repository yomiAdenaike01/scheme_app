<template>
    <div class="request_management">
        <InformationDisplay class="l-3" v-if="requestsInformation.length == 0" :displayText="{heading:'No requests found', content:'All your requests regardless of their status will appear here, to create a request please to go <strong>Create request</strong>'}"/>
        <div v-else class="request_management_inner_wrapper" @click="displayDetails = !displayDetails">
            <InformationDisplay :displayText="{tag:'h2',heading:'Your Requests',content:'Feel free to delete or update your requests below'}"/>
            <div class="request" v-for="request in requestXref" :key="request._id">
                <div class="details_wrapper">
                    <h2 class="mb-4">{{getGroupName('eventGroup',request.type).name}}</h2>

                <p v-for="(key,value) in request" :key="key">
                    <span>{{makePretty(value)}}: {{request[value]}}</span>
                </p>
                </div>
                <div class="buttons_container">
                <Popover trigger='click'>
                <el-button size='mini' round  slot='trigger'>Update Request</el-button>
                <Form submitText='Update request' slot="content" size='mini' :config="requestUpdateConfig" @val="updateRequest($event,request._id)"/>
                </Popover>
                <el-button size='mini' round @click="deleteRequest(request._id)">Delete Request</el-button>
</div>
            </div>
        </div>
        
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import Popover from "@/components/Popover";
import InformationDisplay from '@/components/InformationDisplay';
import Form from "@/components/Form"
export default {
name:'RequestManagement',
data(){
    return{
        displayDetails:false
    }
},
activated(){
    if(this.getIsAdmin){
        this.updateAllStatus();
    }
},
components:{
    InformationDisplay,
    Popover,
    Form
},
computed:{
    ...mapState('Admin',['requestsInformation']),
    ...mapGetters('Admin',['getGroupName','getEnabledEvents']),
    ...mapGetters(['getIsAdmin']),

    // Create the cross referencing

    requestUpdateConfig(){
        // Change the date 
        // Add notes
        let config = [
          {
          "component-type": "date-picker",
          "input-type": "date-time-range",
          placeholder: "Timings",
          start_placeholder: "Start date & time",
          end_placeholder: "End date & time",
          model: "date",
          optional:true
        },
         {
          "component-type": "select",
          placeholder: "Select event type",
          options: this.getEnabledEvents,
          model: "type",
          validType: "number",
          optional:true
        },
        {
            "component-type":'text',
            'input-type':'textarea',
            placeholder:'Notes',
            model:'notes',
            optional:true
        }
     
        ]

       
        return config;
    },

    requestXref(){
        return [...this.requestsInformation].map(request=>{
            return {
                startDate:this.formatDate(request.startDate),
                endDate:this.formatDate(request.endDate),
                dateRequested:this.formatDate(request.dateCreated),
                type:request.type
            }
        })
    }
},
methods:{
    ...mapActions(['request']),
    ...mapActions('Admin',['getRequests']),
    updateRequest(updateInformation,requestID){

    },
    updateAllStatus(){
     
    },
    deleteRequest(requestID){
        this.request({
            method:'DELETE',
            url:'events/requests/delete',
            data:{_id:requestID}
        }).then(()=>{
            this.getRequests()
        }).catch(()=>{
            this.getRequests();
        })
    }
}
}
</script>

<style lang="scss" scoped>
.request_management{
    display:flex;
    flex:1;
    justify-content: center;
}
.l-3{
    line-height: 2.9em;
}
.request_management_inner_wrapper{
    display:flex;
    flex-direction: column;
    flex:1;
    overflow-x: hidden;
   
}
.details_wrapper{
    display:flex;
    flex:1;
    flex-direction: column;
}
.request{
    display:flex;
    flex:1;
    margin:10px;
    padding:10px;
    border:$border;
    cursor: pointer;
    text-transform: capitalize;
    line-height:1.3em;
     &:hover{
        background:$hover_grey;
    }
}
.buttons_container{
    display:flex;
    justify-content: space-between;
    align-items: center;
    &/deep/ > *{
        margin: 0 5px; 
    }
}

</style>