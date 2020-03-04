<template>
<div class="featurerequest_container">
    <FeatureRequest v-for="request in featureRequests[currentIndex]" :key="request._id" :request="request"/>
  </div>
</template>

<script>
import FeatureRequest from "./components/FeatureRequest"
import { mapActions } from 'vuex';
export default {
name:'FeatureRequest',
data(){
    return{
        currentIndex:'all',
        featureRequests:{}
    }
},
activated(){
    this.request({
        url:'user/featureRequests',
        method:'GET',
    }).then(response=>{
        this.featureRequests = response;
    }).catch(err=>{
        return err;
    })
},
methods:{
    ...mapActions(['request'])
}
}
</script>

<style scoped lang="scss">

</style>