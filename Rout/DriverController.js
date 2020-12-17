require('dotenv').config()
const express=require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const { Validator } = require('node-input-validator');
const multer = require('multer');
const saltRounds=10
const mongoose=require('mongoose')
var jwt = require('jsonwebtoken');
const Driver=require('../Schema/driverSignup')
const DriverProfile=require('../Schema/driverprofile');
const { json } = require('body-parser');
const { WSASERVICE_NOT_FOUND } = require('constants');
const JwtVerify=require('../Middlewere/authenticate')


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './image/upload');
  },
  filename: function(req, file, cb) {
    cb(null,  Date.now()+ file.originalname);
  }
});
var upload  = multer({
  storage: storage,

 })
var cpUpload = upload.fields([{ name: 'profile_pic', maxCount: 1 },
{ name: 'driving_license_image', maxCount: 1 }])

 // #######################1   driver signup
router.post('/DriverSignup',async(req,res)=>{
    try{
       let v=await new Validator(req.body,{
           name:'required',
           email:'required|email',
           phone:'required|integer',
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
           res.status(422).json({
             'statusCode':422,
             "message":name+email+phone+password+confirmPassword});
         }
         else{
           let checkDuplicate=await Driver.findOne({email:req.body.email})
                  if(checkDuplicate){
                    res.status(400).json({
                        'statusCode':400,
                      "message":"duplicate  you are already register "})
                    return
                  }
              bcrypt.hash(req.body.password,saltRounds,function(err,hash){
               if(hash){
                   let otp= Math.floor(1000 + Math.random() * 9000);

               const InsertData={
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                password:hash,
                otp:otp
                  }

                 Driver.create(InsertData)
                  //send otp to phone number send otp..........
                 .then(user=>res.status(200).json({
                    'statusCode':200,
                    "message":"Signup Sucessfully otp send to phone",
                    "user_details":user}))
                 .catch(err=>res.status(500).json({
                   'statusCode':500,
                  "message":"Internal Server error ","error":err.message}))
                }
                else{
                     res.status(400).json({
                       'statusCode':400,
                      "message":"something went wrong in encrytion"})}
                  })
                }
              }
    catch(e){
        res.status(400).json({
          'statusCode':400,
          "message":"something went wrong"})

    }

})


//set up drive profile
//############################4
router.post('/DriverProfile',JwtVerify,cpUpload,async(req,res)=>{

      try{
       let v=await new Validator(req.body,{

           vehicale_number:'required',
           driving_license_number:'required',
           })
       let check=await v.check()

       let vehicale_number=v.errors.vehicale_number?v.errors.vehicale_number.message:','
       let driving_license_number=v.errors.driving_license_number?v.errors.driving_license_number.message:','
        if(!check){
           res.status(422).json({
             'statusCode':422,
             "message":vehicale_number+driving_license_number});
         }
         else{
              let user=req.userData
              let id=user._id
              let name=user.name
              console.log(`id is ${id} name is ${name}`)
            //to check driver id is already exist or not
              let get=await  DriverProfile.findOne({driver_id:id})
             if(get){
               res.status(400).json({
                 'statusCode':400,
                 "message":"duplicate profile  "})
               return

             }
             const inserData={
                  profile_pic:req.files['profile_pic'][0].filename,
                  driving_license_image:req.files['driving_license_image'][0].filename,
                    driving_license_number:req.body.  driving_license_number,
                    vehicale_number:req.body.vehicale_number,
                    driver_id:id
             }
             console.log(inserData)
             DriverProfile.create(inserData)
             //if user created profile make is_profile_created=1
             .then(async (user)=>{
               let update=await Driver.updateOne({_id:id},{$set:{is_profile_created:1}})
               res.status(200).json({
                'statusCode':200,
                "message":"profile added sucessfully",
                'profile_details':user})
             })
             .catch(e=>res.status(500).json({
                'statusCode':500,
               "message":"internal server err ",
               "error":e}))
               }
    //console.log(req.files['profile_pic'][0] )
      }
      catch(e){
        // console.log(e)
          res.status(400).json({
              'statusCode':400,
               "message":"something went wrong"})
      }
})
//******************************unused api */
router.post('/DriverSendOtp',async(req,res)=>{
     try{
               let get=await Driver.findOne({_id:req.body.driver_id})
               console.log(get)
               let phone=req.body.phone
                if(get){
                 let otp=Math.floor(1000+Math.random()*9000)
                 //otp send your phone number
                 let update=await Driver.updateOne({$set:{otp:otp}})
                 console.log(update)
                   res.status(200).json({message:'otp send'})
                    }
             else{
               res.status(400).json({message:'wrong Entry'})
                 }
                  }
                  catch(e){

                  }

})

// ###################2
router.post('/DriverVerifyOtp',async(req,res)=>{
    try{
      let v=await new Validator(req.body,{

           email:'required|email',
           otp: 'required|integer'

       })
        let check=await v.check()
       let otp=v.errors.otp?v.errors.otp.message:','
       let email=v.errors.email?v.errors.email.message:','
       if(!check){
           res.status(422).json({
             'statusCode':422,
             "message":email+otp});
         }
         else{
            let get =await Driver.findOne({email:req.body.email})
           console.log(get)
          if(get && get.otp==parseInt(req.body.otp)){
            //set is_otp_verified=1 otp=null
            let update=await Driver.updateOne({email:req.body.email},{$set:{is_otp_verify:1,otp:null}})
            console.log(update)
            res.status(200).json({
                 'statusCode':200,
              "message":'otp verified'});
         }
         else{
            res.status(400).json({
              'statusCode':400,
              "message":'otp not verified wrong email or otp '});
          } }
  }
    catch(e){
           res.status(400).json({
             'statusCode':400,
             'message':'something went wrong'})
}

})

// ###################3
router.post('/DriverLogin',async(req,res)=>{

     try{
    let v=new Validator(req.body,{
      email:'required|email',
      password:'required'
    })
    let check=await v.check()

    let email=v.errors.email?v.errors.email.message:','
     let password=v.errors.password?v.errors.password.message:','
     if(!check){
        res.status(422).json({
             'statusCode':422,
             "message":email+password});

     }
     else{
          let get =await Driver.findOne({email:req.body.email})
       if(get){
         //console.log(get)
         let is_profile_created=get.is_profile_created
         let is_otp_verified=get.is_otp_verify
         let tok=genrateToken(get.toJSON())
        // console.log(tok)

       let hash_password=get.password
       bcrypt.compare(req.body.password, hash_password, function(err, result) {
         if(result){


               if( is_profile_created==0){

           res.status(202).json({
             'statusCode':202,
             message:'login sucessfull redirect to profile setup','token':tok})


              }

              else{
                 res.status(200).json({
                 'statusCode':200,
                message:'login sucessfull redirect to order_details','token':tok})
                 }


         }
         else{
           res.status(400).json({
             'statusCode':400,
            'message':'wrong password or email'})
           }
           })
            }
     else{
         res.status(400).json({
           'statusCode':400,
           'message':'wrong email or password'}) }
    }
}
     catch(e){
        //console.log(e)
          res.status(400).json({
             'statusCode':400,
            'message':'something went wrong'})

     }


})
// ###################7
router.post('/DriverForgotPassword',JwtVerify,async(req,res)=>{
     try{
    let v=new Validator(req.body,{
      email:'required|email',
 })
   let check=await v.check()
    let email=v.errors.email?v.errors.email.message:','
    if(!check){
      res.status(422).json({
        'statusCode':422,
        'message':email})
    }
    else{
         let user=req.userData
         console.log(user._id,user.name)
        let id=user._id
        let get =await Driver.findOne({_id:id,email:req.body.email})
       if(get){
           res.status(200).json({
            'statusCode':200,
            'message':'email matched redirect to resetPassword link'})
       }
       else{
           res.status(404).json({
            'statusCode':404,
            'message':'not found'})
       }

    }

}
 catch(e){

        res.status(400).json({
           'statusCode':400,
          'message':'something went wrong '})
 }

})
// ###################6
router.post('/DriverChangePassword',JwtVerify,async(req,res)=>{
   try{
    let v=new Validator(req.body,{

      old_password:'required',
      new_password:'required'
    })
    let check=await v.check()
    let old_password=v.errors.old_password?v.errors.old_password.message:','
    let new_password=v.errors.new_password?v.errors.new_password.message:','
    if(!check){
      res.status(422).json({
        'statusCode':422,
        'message':old_password+new_password})
    }
    else{
      let user=req.userData
          let id=user._id,name=user.name
          console.log(`id ${id} name ${name}`)
          let get =await Driver.findOne({_id:id})
          //console.log(get)
          if(get){
          let getPassword=get.password
          // console.log(getPassword)
         //check old password matched or not
          bcrypt.compare(req.body.old_password, getPassword,async  function(err, result) {
            if(result==true){
               console.log(result)
                 bcrypt.hash(req.body.new_password, saltRounds, async function(err, hash) {
                 console.log(hash)
               let update=await Driver.updateOne({_id:id},{$set:{ password:hash}})
              // console.log(update)
              res.status(200).json({
                 'statusCode':200,
                'mesaage':'updated successfully'})
                     });
                    }
            else{
              res.status(400).json({
                   'statusCode':400,
                'mesaage':'old pswd not matched'})}});
          }
          else{
            res.status(404).json({
               'statusCode':404,
              'mesaage':'record not found'})
          }

        }
        }
  catch(e){
    res.status(400).json({
        'statusCode':400,
      'message':'something went wrong '})

  }

})

//###################8
router.post('/DriverResetPassword',(req,res)=>{

})



// ###################5
router.post('/DriverEditProfile',JwtVerify,cpUpload,async(req,res)=>{

try{

            let user=req.userData
            console.log(user._id)
             let id=user._id
            let get =await DriverProfile.findOne({driver_id:id})

            // console.log(get)
               if(get){
                 let empty_image=await DriverProfile.updateOne({driver_id:id},{$set:{ profile_pic:',,',driving_license_image:',,'}})

               let update=await DriverProfile.updateOne({driver_id:id},{$set:{
                    profile_pic:req.files['profile_pic'][0].filename,
                   driving_license_image:req.files['driving_license_image'][0].filename,
                    driving_license_number:req.body.driving_license_number,
                    vehicale_number:req.body.vehicale_number

                }})

              res.status(200).json({
                'statusCode':200,
                'message':'updated sucessfully'})

            }
        else{
            res.status(404).json({
              'statusCode':404,
              'message':'record not found'})

        }

    }

catch(e){
  //console.log(e)
         res.status(400).json({
          'statusCode':400,
          'message':'somthing went wrong '}) }

})

const genrateToken=(user=>{

   let token= jwt.sign(user,process.env.PASSPORT_KEY)
   return token


})



module.exports=router