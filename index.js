require('dotenv').config()
let port=process.env.PORT ||3000
const express=require('express')
const app=express();
var cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))
const mongoose=require('mongoose')
 
app.all('*', function(req, res, next) {
     var origin = req.get('origin'); 
     res.header('Access-Control-Allow-Origin', origin);
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header('Access-Control-Allow-Headers', 'Content-Type');
     next();
});
mongoose.connect(process.env.dbhost,  {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('db connection successful'))
    .catch((err) => console.error(err))

var conn = mongoose.connection
// const useRouter=require('../GROCCERYApp/Rout/user')


const Admin=require('./Rout/AdminController')
const Vendor=require('./Rout/VendorController')
const Driver=require('./Rout/DriverController')
const Customer=require('./Rout/CustomerController')
app.use(express.static('image/upload'))
app.use('/',Admin)
app.use('/',Vendor)
app.use('/',Driver)
// app.use('/',useRouter)


app.listen(port)