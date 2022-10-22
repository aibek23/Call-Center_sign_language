const {Router} = require('express')
const config = require('config')
const shortid = require('shortid')
const Time = require('../models/Time')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router();




router.post('/save', auth, async (req, res) => {
  try {
    const times = req.body.time
    const time = new Time({
      data:'656505056', length:times, user: req.user.userId
    })
    User.findById(req.user.userId).time('Time').save();

    await     User.findById(req.user.userId).time('Time').save();
    res.status(201).json({ time })
  } catch (e) {
    res.status(500).json({ message: `Что-то пошло не так, попробуйте сноваssssssssssssssssssssssss${req.body.time}` })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const Times = await Time.find({ owner: req.user.userId })
    res.json(Times)
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const Time = await Time.findById(req.params.id)
    res.json(Time)
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
