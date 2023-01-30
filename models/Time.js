const {Schema, model, Types} = require('mongoose')
 
const Times = new Schema({
  date: {type: Date, default: Date.now},
  duration : {type: Number, required: true},
  user: {type: Types.ObjectId, ref: 'User'},
})
module.exports = model('Time_Length', Times) 
