const {Router} = require('express')
const User = require('../models/User')

router.post(
    
      async (req, res) => {
  try {
    const errors = validationResult(req)
    const {myemail, email} = req.body
    const candidate = await User.findOne({ email })
    if (candidate) {
      return res.status(400).json({ message: `Такой есть ${email}` })
    }
    await
    res.status(201).json({ message: `${email}-онлайн` })
  } catch (e) {
    console.log(e);
  }
}
)