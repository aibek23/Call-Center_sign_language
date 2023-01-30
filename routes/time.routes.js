
const Router = require('express')
const config = require('config')
const shortid = require('shortid')
const Time = require('../models/Time')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router();

// router.use(bodyParser.json());
//  

// /api/time/save
router.post('/save', auth, 
async (req, res) => {
  try {
    const {duration} = req.body;
    console.log(req.body);
    console.log(duration);
    const userId = req.user.userId;
    console.log(userId);
    const existing = await Time.findOne({ userId })
    if (existing) {
      return res.json({ time: existing })
    }
    const time = new Time({
       duration:duration, user: req.user.userId
    })

    await time.save();
    res.status(201).json({ time });
  } catch (e) {
    res.status(500).json({ message: `Что-то пошло не так, попробуйте снова${e}` })
  }
})

router.get('/1', auth, 
async (req, res) => {
  try {
    const Times = await Time.find({"user":"63ceb3701a30a46e3450c6a9"});


      let sum = 0;
      for (let user of Object.values(Times)) {
        sum += user.duration;
      }
      res.json(sum);// all time


  } catch (e) {
    res.status(500).json({ message:`Что-то пошло не так, попробуйте снова   ${e}` })
  }
})

module.exports = router
