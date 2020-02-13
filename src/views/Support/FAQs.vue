<template>
  <div class="faq_container">
    <div class="header_container flex_center columns p-4">
    <h1 class="header_title">Frequently Asked Questions</h1>
    <p class="grey">What would you like to know ? </p>
    </div>
<div class="faq_content_wrapper">
   <div class="inner_wrapper w-50 p-4 ">
   <el-collapse v-model="activeFaq" >
  <el-collapse-item title="Consistency" name="1">
    <template slot="title">
      <h1> Consistency</h1>
    </template>
    <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
    <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
  </el-collapse-item>
  <el-collapse-item title="Feedback" name="2">
       <template slot="title">
      <h1> Feedback</h1>
    </template>
    <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
    <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
  </el-collapse-item>
  <el-collapse-item title="Efficiency" name="3">
       <template slot="title">
      <h1> Efficiency</h1>
    </template>
    <div>Simplify the process: keep operating process simple and intuitive;</div>
    <div>Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;</div>
    <div>Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.</div>
  </el-collapse-item>
  <el-collapse-item title="Controllability" name="4">
       <template slot="title">
      <h1> Controllability</h1>
    </template>
    <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
    <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.</div>
  </el-collapse-item>
</el-collapse>
  </div>
  </div>

  </div>
</template>

<script>
export default {
  name: "FAQ",
  data(){
    return{
      activeFaq:"1"
    }
  },
  computed:{
    faqConfig(){
      return 
        [
          {
            "schedule":{
                "create_event":{
                    "content":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
                }
            }
          }
        ]
    
    }
  }
};
</script>

<style lang="scss" scoped>
.header_container{
  background:rgb(250,250,250);
}
.header_title{
  font-size: 2em;
}

.faq_content_wrapper{
  &/deep/{
    .el-collapse-item{
      padding:10px 0;
      opacity: .7;
      &.is-active{
        opacity: 1;
      }
    }
    .el-collapse-item__arrow {
      font-size: 1.5em;
    }
  }
}
</style>