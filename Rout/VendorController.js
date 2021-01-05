
//639 pipe line
require('dotenv').config()
const express=require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
// const {ObjectId} = require('mongodb')
var ObjectId = require('mongodb').ObjectID;
const multer = require('multer');
var jwt = require('jsonwebtoken');
  const saltRounds=10
  const mongoose=require('mongoose')
const { Validator } = require('node-input-validator');
const Vendor=require('../Schema/vendor')
const Store=require('../Schema/store');
const Catogry=require('../Schema/catogry')
const Product=require('../Schema/product')
const { throws } = require('assert');
const e = require('express');
const { verify } = require('crypto');
const { exit } = require('process');
const verifyJwt=require('../Middlewere/authenticate')
const AdminProduct=require('../Schema/adminProduct')
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
 //browser access http://localhost:3000/1606818358143pic5.jpg

var cpUpload = upload.fields([{ name: 'logo', maxCount: 1 },
{ name: 'gst_image', maxCount: 1 },{ name: 'pan_image', maxCount: 1 }])

//set up store or business_profile validate token which created in login page
router.post('/setupStore',verifyJwt , cpUpload,  async(req, res)=> {
  try{
     let v=await new Validator(req.body,{

            business_name:'required',
            business_email:'required|email',
            business_address1:'required',
            business_address2:'required',
            business_phone:'required',
            city:'required',
            state:'required',
            zip:'required',
            country:'required',
            company_type:'required',
            business_catogry:'required',
            can_deliver:'required',    //1 or 0
            is_merchandise_digital:'required',  //1 or 0
            has_inventory_management_system:'required',  //1 or 0
            gst_number:'required',
            pan_number:'required',


       })
       let check=await v.check()

       let business_name=v.errors.business_name?v.errors.business_name.message:','
       let business_email=v.errors.business_email?v.errors.business_email.message:','
       let  business_address1=v.errors. business_address1?v.errors. business_address1.message:','
       let  business_address2=v.errors. business_address2?v.errors. business_address2.message:','
        let business_phone=v.errors. business_phone?v.errors. business_phone.message:','
       let city=v.errors.city?v.errors.city.message:','
       let state=v.errors.state?v.errors.state.message:','
       let  zip=v.errors. zip?v.errors. zip.message:','
       let  country=v.errors. country?v.errors. country.message:','
       let company_type=v.errors.company_type?v.errors.company_type.message:','
       let business_catogry=v.errors.business_catogry?v.errors.business_catogry.message:','
       let can_deliver=v.errors.can_deliver?v.errors.can_deliver.message:','
       let is_merchandise_digital=v.errors. is_merchandise_digital?v.errors. is_merchandise_digital.message:','
      let has_inventory_management_system=v.errors.   has_inventory_management_system?v.errors.   has_inventory_management_system.message:','
      let gst_number=v.errors.  gst_number?v.errors.  gst_number.message:','
      let pan_number=v.errors. pan_number?v.errors. pan_number.message:','
       if(!check){
         res.status(422).json( {
          'statusCode':422 ,
         'message': business_name+business_address1+business_address2+business_email+business_phone+city+state+zip+country+company_type+business_catogry+can_deliver+is_merchandise_digital+has_inventory_management_system+gst_number+pan_number})
        }

         else{
           //check the rout were user go
           //1 setup store(token content vendor id ckeck store  is_store_profile_completed=0 ||1 ) ) 0 is in setup store ,
           //2 set up inventory product table is this vendor have any product or not
           //  3  if both are true then inventory catalogue

                 // after verification of token
               let user=req.userData
                //get id from token
               let id=user._id
                console.log(id)
                //check vendor is exist or not
                let found=await Vendor.findOne({_id:id})
                  if(!found){
                  res.status(404).json({'statusCode':404 ,'message':'no record found'})
                        return
                    }

                // res.send( req.userData)

              //get id from token
           //check already store created or not
           let duplicate=await Store.find({vendor_id:mongoose.Types.ObjectId(id)})
          // console.log(typeof(duplicate))
           //console.log(duplicate.length)   //>0 then return else insetred
           if(duplicate.length>0){
           res.status(400).json({
             'statusCode':400 ,
            "message":"duplicate store"})
             return
           }
           //check that vendor exist  or not on behalf of token if exist in vendor then insert data 


           let logo=req.files['logo'][0].filename
           let gst_image=req.files['gst_image'][0].filename
           let pan_image=req.files['pan_image'][0].filename

           const InsertData={
            vendor_id:id,
            logo:logo,
            business_name:req.body.business_name,
            business_email:req.body. business_email,
            business_address1:req.body.business_address1,
            business_address2:req.body.business_address2,
            city:req.body.city,
            state:req.body.state,
            business_phone:req.body.business_phone,
            zip:req.body.zip,
            country:req.body.country,
            company_type:req.body.company_type,
            business_catogry:req.body.business_catogry,
            can_deliver:req.body.can_deliver,    //1 or 0
            is_merchandise_digital:req.body.is_merchandise_digital,  //1 or 0
            has_inventory_management_system:req.body. has_inventory_management_system,  //1 or 0
            gst_number:req.body.gst_number,
            gst_image:gst_image,
            pan_number:req.body.pan_number,
            pan_image:pan_image,

        }
            // console.log(InsertData)
            //update  vendor table that is_store_profile=1
          Store.create(InsertData)
          .then((async (user)=>{
           // console.log(user)
            let update=await Vendor.updateOne({_id:id},{$set:{
              is_store_profile:1,
              store_id:user._id

            }})



          res.status(200).json({
            'statusCode':200 ,
            "message":"store created  Sucessfully ",
            'store':user})

          }))
          .catch(err=>res.status(500).json({
            'statusCode':500,
            "message":"Internal Server error ",
            'errors':err.message}))
}
        }
catch(e){
  console.log(e)
     res.status(400).json({
       'statusCode':400 ,
       "message":"something went wrong",

      })

  }
})

//*************** testing

//*************unused send otp
router.post('/sendOtp',async(req,res)=>{
            try{
               let get=await Vendor.findOne({_id:req.body.vendor_id})
               console.log(get)
               let phone=req.body.phone
                if(get){
                 let otp=Math.floor(1000+Math.random()*9000)
                 //otp send your phone number
                 let update=await Vendor.updateOne({$set:{otp:otp}})
                   res.status(200).json({message:'otp updated'})
                    }
             else{
               res.status(400).json({message:'wrong Entry'})
                 }
                  }
          catch(e){
             //console.log(e)
            res.status(400).json({message:'something went wrong'}) }
})

router.post('/verifyOtp',async(req,res)=>{
  try{
          let v=await new Validator(req.body,{
            email:'required|email',
            otp:'required',
          })
           let check=await v.check()
            let email=v.errors.email?v.errors.email.message:','
             let otp=v.errors.otp?v.errors.otp.message:','
              if(!check){
           res.status(422).json({"message":email+otp});
         }
         else{
           let get =await Vendor.findOne({email:req.body.email})
           //console.log(get)
          if(get && get.otp==parseInt(req.body.otp)){
            //set is_otp_verified=1 otp=null
            let update=await Vendor.updateOne({email:req.body.email},{$set:{is_otp_verify:1,otp:null}})
            console.log(update)
            res.status(200).json({"message":'otp verified'});

          }

          else{
          res.status(400).json({"message":'otp not  verified '});}
         }
 }
  catch(e){
    // console.log(e)
     res.status(400).json({message:'something went wrong'})

  }


})
//signup vendor signup id is vendor id in coolection vendor

router.post('/VendorSignup',async(req,res)=>{
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

           bcrypt.hash(req.body.password,saltRounds,async function(err,hash){
             let otp= Math.floor(1000 + Math.random() * 9000);
               if(hash){
               const InsertData={
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                password:hash,
                otp:otp
                  }

                  let checkDuplicate=await Vendor.findOne({email:req.body.email})
                  if(checkDuplicate){
                    res.status(400).json({
                      'statusCode':400 ,
                      'message':'duplicate data you are already register'})
                  }
                  else{
                 Vendor.create(InsertData)
                 .then(user=>{

                res.status(200).json({
                  'statusCode':200 ,
                  "message":"Signup Sucessfully" ,user_details:user})})
                 .catch(err=>
                  res.status(500).json({
                    'statusCode':500 ,
                    "message":"Internal Server error",
                    "error":err.message}))
                  }
                }
                else{
                     res.status(400).json({
                       'statusCode':400 ,
                       "message":"something went wrong",err})

                }
                  })
                }
             }
     catch(err){
     res.status(400).json({
       'statusCode':400 ,
       "message":"something went wrong",
       "error":err.message})
     }
    })


router.post('/vendorlogin',async(req,res)=>{
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
         'stausCode':422,
        'message':email+password})
     }
     else{
       let get =await Vendor.findOne({email:req.body.email})
       if(get){
         //console.log(get)
          let is_store_profile=get.is_store_profile           //1 redirect to inventory setup
         let is_otp_verified=get.is_otp_verify
         let is_product_profile=get.is_product_profile

         console.log(is_otp_verified)
         //console.log(get)
         //create token
         let tok=genrateToken(get.toJSON())
        // console.log(tok)
       let hash_password=get.password
       bcrypt.compare(req.body.password, hash_password, function(err, result) {
            console.log(result)

         if(result){
            res.status(200).json({
             'statusCode':200 ,
              'message':'login sucessfull  ',
             'user':get,
             "token":tok,})

         }
         else{
           res.status(401).json({
             'statusCode':401 ,
             'message':'wrong password or email'})

         }

          });

      }
      else{
        res.status(401).json({
          'statusCode':401 ,
         'message':'wrong `email` or password'})
      }

     }

  }
  catch(e){
    res.status(400).json({
      'statusCode':400 ,
      'message':'something went wrong'})

  }

})
//get catogry of all type
//fetch all catogry
router.get('/fetchCatogry',async(req,res)=>{
  try{
    //get catogry
    let get=await Catogry.find({},{catogry_name:1,_id:1})
     //let fetch Catogry= get.map(obj= >obj['catogry_name'])
     res.status(200).json({
       'statusCode':200,
      "message":get})
     }
  catch(e){
    res.status(500).json({
      'statusCode':500,
      message:'internal server error'
    })

  }
})

//add manual catogry /addCatogry rout http://localhost:3000/addCatogry

//product table catogry id ,, product name, product image, description ,discount
router.post('/addProduct',verifyJwt , upload.array('photos', 4),async(req,res)=>{
  try{
  let v=await new Validator(req.body,{
           catogry_id:'required',
           store_id:'required',
           product_name:'required',
           description:'required',
           discount:'required',
           unit_price:'required'

       })
       let check=await v.check()
       let catogry_id=v.errors.catogry_id?v.errors.catogry_id.message:','
       let store_id=v.errors.store_id?v.errors.store_id.message:','

       let product_name=v.errors.product_name?v.errors.product_name.message:','
       let description=v.errors. description?v.errors. description.message:','
       let discount=v.errors.discount?v.errors.discount.message:','
           let unit_price=v.errors.unit_price?v.errors.unit_price.message:','

       if(!check){
         res.status(422).json({
         'statusCode':422,
         'message':catogry_id+store_id+product_name+description+discount+unit_price})
       }
       else{


        if(req.files.length>0){
         let image_array=[]
         for(let i=0;i<req.files.length;i++)
             image_array.push(req.files[i].filename)
             let user=req.userData
               console.log(user._id)
                 let id=user._id
                 console.log(user.name)
                 //is store create or not
                  let checkVendor=await Vendor.findOne({_id:id})
                 if(!checkVendor){
                   res.status(404).json({
                       'statusCode':404,
                       'message':'vendor not exist '})
                     return

                 }

                   let checkStore=await Store.find({_id:req.body.store_id})
                   if(checkStore.length==0)
                   {
                      res.status(404).json({
                       'statusCode':404,
                       'message':'store id not exist '})
                     return
                   }


         //check duplicate value in product with same vendor id and product name
           let check=await Product.findOne({vendor_id:id,product_name:req.body.product_name})

           if(check){
             res.status(201).json({
               'statusCode':201,
                'message':'product name  are already exist'})
             return
             }


           const InsertData={
           catogry_id:req.body.catogry_id,
           store_id:req.body.store_id,
           vendor_id:id,         //id get by token
           image_array:image_array,
           product_name:req.body.product_name,
           unit_price:req.body.unit_price,
           description:req.body.description,
           discount:req.body.discount
          }
        // console.log(InsertData)
         Product.create(InsertData)
         .then((async (user)=>{
             let update=await Vendor.updateOne({_id:id},{$set:{
              is_product_profile:1

            }})
            //console.log(update)


          res.status(200).json({
           'statusCode':200,
           "message":"product added sucessfully",'product':user})}))
         .catch(err=> res.status(500).json({
           'statusCode':500,
           "message":"internal server error",
           "error":err
          }))

      }
      else{
       res.status(400).json({
        'statusCode':400,
        "message":"please upload file"})
      }
      }
     }
      catch(e){
       console.log(e)
         res.status(400).json({
          'statusCode':400,
          'error':e,
          'message':'something went wrong',
           })

      }



})



//catalogue catogry+product table

// **** fetch product
router.post('/fetchProduct',async(req,res)=>{
         try{
           let fetch=await Product.find({})
           console.log(fetch)
           res.send(fetch)

         }
         catch(e){

         }
})

//catalogue inventory vendor_id product===>catogry id====>catogry name===>product name==>description
//require jwt
router.get('/inventoryCatalogue',verifyJwt,async(req,res)=>{
  try{

       const page=req.query.pagination?parseInt(req.query.pagination):1
       const limit=req.query.page?parseInt(req.query.page):3
       let user=req.userData,count=0
         // console.log(user._id,user.name)
         let user_id=user._id
           //check exist in vendor or not
           let found=await Vendor.findOne({_id:user_id})
          // console.log(found)
           if(!found){
             res.status(404).json({'statusCode':404 ,'message':'no record found'})
             return
           }

             let get =await Product.aggregate([
              {$match:{ vendor_id : mongoose.Types.ObjectId(user_id)}},  //status:1
              { $group: { _id: "$catogry_id"} },

               ])
             //console.log(get)
               if(get.length>0){
                  let ids = get.map(obj=>obj['_id'])
           // console.log(ids)
              let getProduct=[]
               for(const id of ids){


           console.log(id)
             let getCatName=await Catogry.findOne({_id:id})
             let cat_name=getCatName.catogry_name


            console.log('user id =====>' +user_id)

            let check=await Product.aggregate([
           {$match:{$and :[{catogry_id:mongoose.Types.ObjectId(id)},{vendor_id:mongoose.Types.ObjectId(user_id)}]}},
          // { $sort: { _id: -1 } } ,
              {$lookup:{from:"stores",localField:"store_id",foreignField:"_id",as:"store"}},
               {$unwind:{path:'$store',preserveNullAndEmptyArrays:true}},

                {$project:{

                    store_city:"$store.city",
                    store_logo:"$store.logo",
                    is_deliver:"$store.can_deliver",
                    has_inventory_management_system:"$store.has_inventory_management_system",
                    business_name:"$store.business_name",
                    business_email:"$store.business_email",
                     product_name:1,
                     description:1,
                     discount:1,
                     unit_price:1,
                     image_array:1
                }}

            ])


           getProduct.push(
           {
           catogry_name:cat_name,
           product:check,
           })
           console.log(getProduct)

         }
         res.status(200).json({
            'statusCode':200,
            'vendor_name':user.name,
            'result':getProduct


          })

               }
               else{
                   res.status(404).json({
                     'statusCode':404,
                     'message':'not found'

                    })

                  }
                 }

           catch(e){
            console.log(e)
          res.status(400).json({
            'statusCode':400,
            'message':'something went wrong'})
                }
 })


//aggregation pipeline
router.get('/getData',async(req,res)=>{
  let vendor_id=req.body.vendor_id
      let getData=await Catogry.aggregate([
            {$lookup:
                {from:"products",
                    let: { catogry_id:"$catogry_id",store_id:"$store_id"},
                  "pipeline":[

                     {$match:{$and :[{"catogry_id":mongoose.Types.ObjectId("$$catogry_id")},{"vendor_id":mongoose.Types.ObjectId(vendor_id)}]}},
                     { $project: { _id: 1 ,product_name:"$product_name",store_id:"$store_id" } },
                      ],
                    as:"details"
                }},



])
res.json(getData)

})


router.get('/editStore',verifyJwt,cpUpload,async(req,res)=>{
  try{
    let v=new Validator(req.body,{
      store_id:'required'

    })
    let check=await v.check()
    let store_id=v.errors.store_id?v.errors.store_id.message:','

    if(!check){
      res.status(422).json({
        'statusCode':422,
        'message':store_id})
    }
    else{
         let user=req.userData
         console.log(user._id)
          let user_id=user._id
          let found=await Vendor.findOne({_id:user_id})
            if(!found){
             res.status(404).json({'statusCode':404 ,'message':'no record found'})
             return
           }


          let get=await Store.findOne({_id:req.body.store_id})
          console.log(get)
          if(get){
             //empty the image field
           let empty_image=await Store.updateOne({_id:req.body.store_id},{$set:{ logo:',,',gst_image:',,', pan_image:',,'}})
            let logo=req.files['logo'][0].filename
           let gst_image=req.files['gst_image'][0].filename
           let pan_image=req.files['pan_image'][0].filename
           let update=await Store.updateOne({$set:{
            vandor_id:req.body.vandor_id,
            logo:logo,
            business_name:req.body.business_name,
            business_email:req.body. business_email,
            business_address1:req.body.business_address1,
            business_address2:req.body.business_address2,
            city:req.body.city,
            state:req.body.state,
            zip:req.body.zip,
            country:req.body.country,
            company_type:req.body.company_type,
            business_catogry:req.body.business_catogry,
            can_driver:req.body.can_driver,    //1 or 0
            is_merchandise_digital:req.body.is_merchandise_digital,  //1 or 0
            has_inventory_management_system:req.body. has_inventory_management_system,  //1 or 0
            gst_number:req.body.gst_number,
            gst_image:gst_image,
            pan_number:req.body.pan_number,
            pan_image:pan_image,
          }

          })
          res.status(200).json({'statusCode':200,'message':'updated Sucessfully'})


        }
         else{
              res.status(200).json({'statusCode':404,'message':'no store found'})
          }
      }
    }



  catch(e){
    res.status(400).json({'statusCode':400,"message":"something went wrong"})

  }
})
//pagination
router.get('/paginate',async(req,res)=>{
    try{
      //localhost:3000/paginate?page=1&pagination=10

      const page=req.query.page?parseInt(req.query.page):1
         const limit=req.query.limit?parseInt(req.query.limit):2

         const skip=(limit*page)-limit    //page-1*limit


      console.log(`page size  is ${limit} skip  is ${skip}`)
     const getProduct=await Product.find({}).skip(skip).limit(limit)
    // console.log(getProduct)
     res.json({'length':getProduct.length,'product':getProduct})
    }
    catch(e){

    }
})


router.post('/changePassword',verifyJwt,async(req,res)=>{
  try{
    let v=new Validator(req.body,{

      old_password:'required',
      new_password:'required'
    })
    let check=await v.check()
    let old_password=v.errors.old_password?v.errors.old_password.message:','
    let new_password=v.errors.new_password?v.errors.new_password.message:','
    if(!check){
      res.status(422).json({'statusCode':422,'message':old_password+new_password})
    }
    else{

      let user=req.userData
        let id=user._id
        let name=user.name
      console.log(`vendor id is ${id} name is ${name}`)
         //check vendor is exist or not
         let get=await Vendor.findOne({_id:id})
         console.log(get)
         let getPassword=get.password
         console.log(getPassword)
         if(get){
           //check old password is matched or not
           bcrypt.compare(req.body.old_password, getPassword, async function(err, result) {
            console.log(result)
            if(result==true){
              bcrypt.hash(req.body.new_password, saltRounds, async function(err, hash) {
                 console.log(hash)
               let update=await Vendor.updateOne({_id:id},{$set:{ password:hash}})
              // console.log(update)
              res.status(200).json({
                 'statusCode':200,
                'mesaage':'updated successfully'})
               });
               }
            else{
               res.status(400).json({
                 'statusCode':400,
                'mesaage':'old password is not matched'})

            }
              });

         }
         else{
           res.status(404).json({
                 'statusCode':404,
                'mesaage':'no record found'})
         }




    }
  }




  catch(e){
    console.log(e)
    res.status(400).json({message:'something went wrong '})

  }

})

//
router.post('/forgotPassword',async(req,res)=>{
  try{
    let v=new Validator(req.body,{
      email:'required|email',
 })
   let check=await v.check()
    let email=v.errors.email?v.errors.email.message:','
    if(!check){
      res.status(422).json({'message':email})
    }
    else{
        let get =await Vendor.findOne({email:req.body.email})
       if(get){
           res.status(200).json({'message':'email matched go to /changePassword link'})
       }
       else{
           res.status(400).json({'message':'email is not registerd'})
       }

    }

}
 catch(e){

        res.status(400).json({'message':'somrthing went wrong '})
 }

})

router.post('/getStore',verifyJwt,async(req,res)=>{
   try{
    let v=new Validator(req.body,{
        store_id:'required'
    })
    let check=await v.check()
    let id=v.errors.store_id?v.errors.store_id.message:','
    if(!check){
      res.status(422).json({'statusCode':422,'message':id})
    }
    else{
      console.log(req.body.store_id)
      let findStore=await Store.findOne({_id:req.body.store_id})
      console.log(findStore)
      if(findStore){
         res.status(200).json({'statusCode':200,'store':findStore})

      }
      else{
        res.status(404).json({'statusCode':404,'message':'store id not exist'})
      }

    }

  }
  catch(e){
    console.log(e)
     res.status(404).json({'statusCode':400,'message':'something went wrong'})

  }

})

router.post('/customerCatalogue',async(req,res)=>{
  try{
  let get=await Product.aggregate([

   {$group:{_id:"$catogry_id"}},

])

// get catogry id
 let ids=get.map(obj=>obj['_id'])
  //console.log(ids)
  let getProduct=[]
  for(const id of ids){

    let getCatName=await Catogry.findOne({_id:id})
    let cat_name=getCatName.catogry_name

          let get=await Product.aggregate([
            {$match:{catogry_id:mongoose.Types.ObjectId(id)}},
            {$lookup:{from:"stores",localField:"store_id",foreignField:"_id",as:"store"}},
             {$unwind:{path:'$store',preserveNullAndEmptyArrays:true}},
            {$project:{
                   store_city:"$store.city",
                    store_logo:"$store.logo",
                    is_deliver:"$store.can_deliver",
                    has_inventory_management_system:"$store.has_inventory_management_system",
                    business_name:"$store.business_name",
                    business_email:"$store.business_email",
                   store:"$store.logo",
                    product_name:1,
                    image_array:1,
                    description:1,
                    store_id:"$store._id",
                    vendor_id:1
                  }}])
           getProduct.push({
             catogry_name:cat_name,
             product:get

           })


  }
  res.status(200).json({
    'status_code':200,
   'products':getProduct
  })
  }
  catch(e){
    console.log(e)
  }
})

//serach api by name qurry 
router.get('/findVendor/:name',async(req,res)=>{
  try{
    let name=req.params.name
    console.log(name)
    // let regex=new RegExp(name,'i')
    await Vendor.find({name:{$regex:name,$options:'$i'}},{name:1,email:1,phone:1,status:1}).
    then((result)=>{
      if(result.length>0)
      res.status(200).json({'statusCode':200,'result':result})
      else{
       res.status(404).json({'statusCode':404,'message':'no record found'})
      }
    }).
    catch(e=>res.status(500).json({'statusCode':500,'message':e.message}))

  }
  catch(e){
    res.status(400).json({'statusCode':400,'message':'something went wrong'})


  }

})
///serch for product name

router.get('/getProductName/:product_name',verifyJwt,async(req,res)=>{
  try{
    let user_id=req.userData
   let id=user_id._id
   console.log(id)
     let product_name=req.params.product_name

       let get=await  Product.aggregate([
       {$match:{$and:[
       {vendor_id:mongoose.Types.ObjectId(id)},{product_name:{$regex:product_name,$options:'$i'}}

    ]}}])
    if(get.length>0){
      let length=get.length
       res.status(200).json({statusCode:200,'total_record':length,'result':get})

    }
    else{
      res.status(404).json({statusCode:404,'message':'no record found'})

    }



  }
  catch(e){
    console.log(e)
       res.status(400).json({'statusCode':400,'message':'something went wrong'})
  }
})

//addd product from admin product //adminProductid,storeid,vendorid,unitprice,discount
//form product admit ,image,description,product_name,catogry_id
router.post('/addProductVendor',verifyJwt,async(req,res)=>{
  try{
      let v=await new Validator(req.body,{
           product_id:'required',
           store_id:'required',
           unit_price:'required',
           discount:'required',


       })
       let check=await v.check()
       let product_id=v.errors.product_id?v.errors.product_id.message:','
       let store_id=v.errors.store_id?v.errors.store_id.message:','
       let unit_price=v.errors.unit_price?v.errors.unit_price.message:','
       let discount=v.errors.discount?v.errors.discount.message:','
       if(!check){
           res.status(422).json({'statusCode':422,"message":product_id+store_id+unit_price+discount});
         }
         else{
             let user=req.userData
           console.log(user._id,user.name)
            let id=user._id
           //console.log(req.body.product_id)
           //get the details from admin product table
           let findAdminProduct=await AdminProduct.findOne({_id: req.body.product_id})
           if(findAdminProduct){
             //check duplicate vendor id+product name
             let duplicate=await Product.findOne({vendor_id:id,product_name:findAdminProduct.product_name})
             console.log(duplicate)
             if(duplicate){

               res.status(400).json({'statusCode':400,'message':'duplicate product product is already exist '})
               return
             }
         //  console.log(typeof(findAdminProduct.catogry_id))

           const inserData={
             image_array:findAdminProduct.image_array,
             description:findAdminProduct.description,
             catogry_id:findAdminProduct.catogry_id,
             product_name:findAdminProduct.product_name,
             store_id:req.body.store_id,
             unit_price:req.body.unit_price,
             discount:req.body.discount,
             vendor_id:id

           }
           //console.log(inserData)
           let insert=await Product.create(inserData).then((user)=>{
            // console.log(user)
              res.status(200).json({'statusCode':200,'message':'product added sucessfully','product_details':user})



           }).catch(e=>res.status(500).json({'statusCode':500,'message':'internal server error','error':e.message}))

          }
          else{
            res.status(400).json({'statusCode':400,'message':'data not fetched'})

          }
         }
       }
  catch(e){
    console.log(e)
    res.status(400).json({'statusCode':400,'message':'something went wrong'})

            }

 })



const genrateToken=(user=>{
let token= jwt.sign(user,process.env.PASSPORT_KEY)
   return token
})

module.exports=router
