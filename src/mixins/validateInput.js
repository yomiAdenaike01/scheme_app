export default {
    methods:{
     validateInput (formConfig, validateAgainst){
    let result = '';
    // Get the models and build an array for comparison 
    let models = formConfig.map(config=>{
        return config?.model;
    })
    // validate against will be an array of keys
    for(let i = 0, len = validateAgainst.length; i < len; i++){
        let validInput = validateAgainst[i];
        
        if(models.indexOf(validInput) == -1){
            result = false;
            break;
        }else{
            result = true;
        }
    }
return result;
     }
    }

}   