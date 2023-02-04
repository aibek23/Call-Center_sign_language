
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
    const {duration,videoName , callFrom} = req.body;
    const userId = req.user.userId;
    const existing = await Time.findOne({ userId })
    if (existing) {
      return res.json({ time: existing })
    }
    if(duration>3){
    const time = new Time({
      videoName:videoName, duration:duration,callFrom:callFrom, user: req.user.userId
    })

    await time.save();
    res.status(201).json({ time });
  }
  } catch (e) {
    res.status(500).json({ message: `Что-то пошло не так, попробуйте снова${e}` })
  }
})

router.get('/1', auth, 
async (req, res) => {
  try {
    const Times = await Time.find({"user":"63d81dc76ec88a5120e89cab"});


      let sum = 0;
      for (let user of Object.values(Times)) {
        sum += user.duration;
      }
      res.json(sum);// all time


  } catch (e) {
    res.status(500).json({ message:`Что-то пошло не так, попробуйте снова   ${e}` })
  }
})

router.get('/2', auth, 
async (req, res) => {
  try {
    const Times = await Time.find({"user":"63dd6394a743f53c3c5a8c57"});


      let sum = 0;
      for (let user of Object.values(Times)) {
        sum += user.duration;
      }
      res.json(sum);// all time


  } catch (e) {
    res.status(500).json({ message:`Что-то пошло не так, попробуйте снова   ${e}` })
  }
})

// router.get('/3', auth, 
// async (req, res) => {
//   try {
//     const Times = await Time.find({"user":"63ceb3701a30a46e3450c6a9"});


//       let sum = 0;
//       for (let user of Object.values(Times)) {
//         sum += user.duration;
//       }
//       res.json(sum);// all time


//   } catch (e) {
//     res.status(500).json({ message:`Что-то пошло не так, попробуйте снова   ${e}` })
//   }
// })
// router.get('/4', auth, 
// async (req, res) => {
//   try {
//     const Times = await Time.find({"user":"63ceb3701a30a46e3450c6a9"});


//       let sum = 0;
//       for (let user of Object.values(Times)) {
//         sum += user.duration;
//       }
//       res.json(sum);// all time


//   } catch (e) {
//     res.status(500).json({ message:`Что-то пошло не так, попробуйте снова   ${e}` })
//   }
// })

module.exports = router
