const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//User Schema
let userSchema = new Schema({
  user_id: Schema.Types.ObjectId,
  firstname:{
    type:String,
    required:true
  },
  middlename:{
    type:String,
    required:false
  },
  lastname:{
    type:String,
    required:true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  mobile_number:{
    type:Number,
    required:true
  },
  photo:{
    type:String,
    required:false
  },
  profession:{
    type:String,
    required:false
  },
  email:{
    type:String,
    required:false
  },
  role:{
    type:String,
    required:false
  },
  trial:{
    type:String,
    required:false
  },
  wallet:String,
  registered_facility:Array,
  registered_datetime:Date
});

let User = module.exports = mongoose.model('User',userSchema);
