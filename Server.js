require('dotenv').config()
const express=require('express')
const app=express();
var cors = require('cors')

app.use(cors())
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true }))
const mongoose=require('mongoose')



mongoose.connect(process.env.db_host,  {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('db connection successful'))
    .catch((err) => console.error(err))

var conn = mongoose.connection
const useRouter=require('../GrocerryApp/Rout/user')
const Admin=require('../GrocerryApp/Rout/AdminController')
const Vendor=require('./Rout/VendorController')
const Driver=require('./Rout/DriverController')
app.use(express.static('image/upload'))
app.use('/',Admin)
app.use('/',Vendor)
app.use('/',Driver)
app.use('/',useRouter)


app.listen(3000)