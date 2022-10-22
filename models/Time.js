const {Schema, model, Types,relationship, plugin} = require('mongoose')
 
const Times = new Schema({
  date: {type: Date, default: Date.now},
  length : {type: Number, required: true},
  user: {type: Types.ObjectId, ref: 'User'},
})
module.exports = model('Time_Length', Times) 
