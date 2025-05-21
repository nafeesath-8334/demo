const express = require('express')
const { login, register, getUser, editUser, addAds, getAllAds, getAdById, updateAd, getUserAds, forgotPswd, deleteAd, searchItem, resetPassword,searchLocation,getUserFavorites, addToFavorites, removeFromFavorites } = require('../controller/controller')
const upload = require('../middleware/multerMiddleware')
const uploadAds=require('../middleware/multerMiddleware')
const jwtMiddleware=require('../middleware/jwtMiddleware')
const router = new express.Router()
router.post('/login', login)
router.post('/register',register)
router.get('/getUserDetails/:userId/',getUser)
router.put("/editUserDetails/:userId/",jwtMiddleware,upload.single("img"),editUser)

router.post('/addAds/',uploadAds.array("images", 5),addAds)
router.get('/getAllAds',getAllAds)
router.get('/getAds/:userId/',getUserAds)
router.get('/getAdById/:adId/', getAdById)
router.put('/updateAd/:adId/', uploadAds.array('images',5), updateAd);
router.delete('/deleteAd/:adId', deleteAd);

router.get('/searchItem/:query',searchItem)
router.get('/searchLocation/:query',searchLocation)
router.post('/forgotPassword',forgotPswd)

router.post("/resetPassword/:token", resetPassword)

router.get('/getUserFavorites/:userId',getUserFavorites)
 router.post('/addToFavorites/:userId/:adId', addToFavorites);
 router.delete('/removeFromFavorites/:userId/:adId', removeFromFavorites);
module.exports=router;