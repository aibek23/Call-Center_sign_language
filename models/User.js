const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true},
  surname: {type: String, required: true},
  password: {type: String, required: true},
})

module.exports = model('User', schema)

//date of creation
