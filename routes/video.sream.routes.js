const Router = require('express')
const config = require('config')
const shortid = require('shortid')
const Time = require('../models/Time')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router();

// /api/video/operator/id
router.get('/operator/:id', auth,
async (req, res) => {
    try {
      var operatorId
      if (req.params.id == "1")
      {operatorId = "63d81dc76ec88a5120e89cab"}else if(req.params.id == "2")
      {operatorId = "63dd6394a743f53c3c5a8c57"}else if(req.params.id == "3")
      {operatorId = "63de986eccd1692dea7487fb"}else if(req.params.id == "4")
      {operatorId = "63de98a1ccd1692dea7487fc"}else if(req.params.id == "5")
      {operatorId = "63de98caccd1692dea7487fd"}
      const Times = await Time.find({"user":`${operatorId}`});
      res.json(Times);// all time

      } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'+e})
      }
})

module.exports = router