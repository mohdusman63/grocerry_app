







genrateToken(user.toJson())
//in rout called verify token function
let clientToken=req.headers['authorization'].split(" ")[1]
           //console.log(clientToken)
           const vendor_id=verifyToken(clientToken,res)
          //  console.log(vendor_id._id)
            let id=vendor_id._id
           console.log(id)  // vendor id
           console.log(`vendor name ${vendor_id.name}`)




 const verifyToken=(token,res)=>{
       try{
      var decoded = jwt.verify(token, process.env.PASSPORT_KEY);
    return decoded
}
    catch(e){
      console.log(e)
         res.status(404).json({"message":'invalid token '})
    }
  }

const genrateToken=(user=>{

   let token= jwt.sign(user,process.env.PASSPORT_KEY)
   return token


})






 if(req.files){
  let logo=req.files['logo'][0].filename
  console.log(f)

 res.send(req.files)
  }

   try{
       let v=await new Validator(req.body,{
           name:'required',
           email:'required|email',
           phone:'required',
           password:'required',
           confirmPassword:'required'

       })
       let check=await v.check()
       let name=v.errors.name?v.errors.name.message:','
       let email=v.errors.email?v.errors.email.message:','
       let phone=v.errors.phone?v.errors.phone.message:','
       let password=v.errors.password?v.errors.password.message:','
       let confirmPassword=v.errors.confirmPassword?v.errors.confirmPassword.message:','
       if(!check){
           res.status(422).json({"message":name+email+phone+password+confirmPassword});
         }
        }
        catch(){

        }

          unique_id: c,
        Name: req.body.title,
        image1: req.files[0] && req.files[0].filename ? req.files[0].filename : '',
        image2: req.files[1] && req.files[1].filename ? req.files[1].filename : '',
      });


       let get =await Product.aggregate([
    {$match:{ vendor_id : mongoose.Types.ObjectId(req.body.vendor_id)}},
    {$lookup:{from:"catogries",localField:"catogry_id",foreignField:"_id",as:"catogry"}},
    {$unwind:{path:'$catogry',preserveNullAndEmptyArrays:true}},
    {$project:{
   product_name:1,
   description:1,
   unit_price:1,
   discount:1,
   image_array:1,
   catogry_name:'$catogry.catogry_name',

  }}













  let match=await Vendor.findOne({_id:req.body.vendor_id})
    if(match){
      if(match.otp==req.body.otp){
       let set_otp=await  Vendor.updateOne({_id:req.body.vendor_id},{$set:{otp:null}})
        res.status(200).json({message:'otp  matched'})
      }
      else{
        res.status(400).json({message:'wrong otp'})
      }

    }
    else{
      res.status(400).json({message:'wrong vendor id'})

    }
