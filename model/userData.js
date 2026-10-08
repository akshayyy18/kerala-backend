const mongoose = require("mongoose")

const userDetails = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
        type:String,
        enum:["customer","customer"],
        default:"customer"
    }
  },
  { timestamps: true },

)

module.exports = mongoose.model("userData",userDetails) 