// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './image/upload');
//   },
//   filename: function(req, file, cb) {
//     cb(null,  Date.now()+ file.originalname);
//   }
// });
// var upload  = multer({
//   storage: storage,

//  })


// module.exports=(upload.single('avatar'),(req,res,next)=>{
//     console.log(req.file)

//     next()



// })