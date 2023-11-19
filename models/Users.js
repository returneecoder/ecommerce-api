const mongoose= require ('mongoose')
const validator = require ('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,'Please add a name'],
    maxlength:50,
    minlength:3,
},
email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
    /* match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ], */
      
password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  role:{
    type:String,
    enum:['admin','user'],
    default:'user'
  },

})


UserSchema.pre('save',async function() {
  /* if we use  model.save the we need to add the below lines for password*/
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,salt)
})

UserSchema.methods.comparePassword = async function(candidatePassword){
  const isMatch = await bcrypt.compare(candidatePassword,this.password)
  return isMatch
}

module.exports = mongoose.model('User',UserSchema)