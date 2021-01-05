var jwt = require('jsonwebtoken');
module.exports=((req,res,next)=>{
    try{
        var token =req.body.token;
      var decoded = jwt.verify(token,process.env.SECRET_LOG_KEY);
      req.userData=decoded
    //   console.log(decoded)
      next()
    }
    catch(error){
        res.status(404).json({"message":'token not exist'})
    }

})
