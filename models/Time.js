const {Schema, model, Types} = require('mongoose')
 
const Times = new Schema({
  date: {type: Date, default: Date.now},
  videoName:{type: String, required: true},
  callFrom:{type: String, required: true},
  duration : {type: Number, required: true},
  user: {type: Types.ObjectId, ref: 'User'},
})
module.exports = model('Time_Length', Times) 
