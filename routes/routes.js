const express = require('express')
const { login, register, getUser, editUser, addAds, getAllAds } = require('../controller/controller')
const upload = require('../middleware/multerMiddleware')
const uploadAds=require('../middleware/multerMiddleware')
const router = new express.Router()
router.post('/login', login)
router.post('/register',register)
router.get('/getUserDetails/:userId/',getUser)
router.put("/editUserDetails/:userId/",upload.single("img"),editUser)

router.post('/addAds/',uploadAds.array("images", 5),addAds)
router.get('/getAllAds',getAllAds)




module.exports=router