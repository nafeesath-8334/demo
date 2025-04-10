const multer=require("multer")
const path=require("path")
const storage=multer.diskStorage({
    destination: "./upload/",
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  };
  const upload=multer({storage,fileFilter})
  module.exports=upload



  // const storageAds=multer.diskStorage({
  //   destination: "./uploadsAds/",
  //   filename: (req, file, cb) => {
  //     cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  //   },
  // });
  // const fileFilterAds = (req, file, cb) => {
  //   if (file.mimetype.startsWith("image/")) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error("Only image files are allowed!"), false);
  //   }
  // };
  // const uploadAds=multer({storageAds,fileFilterAds})
  // module.exports=uploadAds
  
