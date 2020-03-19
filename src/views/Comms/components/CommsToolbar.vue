<template>
  <div class="comms_toolbar_containter">
      <h4>{{username}}</h4>
  </div>
</template>

<script>
export default {
name:'CommsToolbar',
props:{
    recieverInformation:{
        type:Object,
        default:()=>{
            return{
                name:''
            }
        }
    }
},
computed:{
    username(){
        return this.recieverInformation?.name;
    }
}
}
</script>

<style scoped lang='scss'>
.comms_toolbar_containter{
    border-bottom: $border;
    flex:1;
    padding:20px;
}
</style>