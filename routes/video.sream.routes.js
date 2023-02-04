// const Router = require('express')
// const fs = require('fs')
// const path = require('path')
// const router = Router();






const Router = require('express')
const exports = require('events')
const config = require('config')
const shortid = require('shortid')
const Time = require('../models/Time')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router();

// router.use(bodyParser.json());
//  

// /api/video/operator/id
router.use('/', express.static(path.join(__dirname)))
router.get('/operator/id', auth, 
async (req, res) => {

    var  operatorVide
    switch (req.params.id) {
        case "1":
            operatorVide = "operator1@gmail.com"
            break;
        case "2":
            break;
        case "3":
            break;
        case "4":
            break;
        case "5":
            break;
        default:
            break;
    }
    try {

        res.json(link)
      } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
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

// router.get('/:id', function(req, res) {

//   const path = 'video/sample.mp4'
//   const stat = fs.statSync(path)
//   const fileSize = stat.size
//   const range = req.headers.range

//   if (range) {
//     const parts = range.replace(/bytes=/, "").split("-")
//     const start = parseInt(parts[0], 10)
//     const end = parts[1]
//       ? parseInt(parts[1], 10)
//       : fileSize-1

//     if(start >= fileSize) {
//       res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
//       return
//     }
    
//     const chunksize = (end-start)+1
//     const file = fs.createReadStream(path, {start, end})
//     const head = {
//       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//       'Accept-Ranges': 'bytes',
//       'Content-Length': chunksize,
//       'Content-Type': 'video/webm',
//     }

//     res.writeHead(206, head)
//     file.pipe(res)
//   } else {
//     const head = {
//       'Content-Length': fileSize,
//       'Content-Type': 'video/mp4',
//     }
//     res.writeHead(200, head)
//     fs.createReadStream(path).pipe(res)
//   }
// })
