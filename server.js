
const express = require('express');
// const { exec } = require('child_process');
// const multer = require('multer');
// const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongo = require("mongo");
const cron = require("node-cron");

const app = express();
require('dotenv').config();
// const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//conect db
const db = "mongodb+srv://singhdalpat8182:ravindra@cluster0.xbqceub.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

}).then(() => {

  console.log("connection succesfull")

}).catch((err) => console.log(err));

//moongoose contact form schema
const expesnseData = new mongoose.Schema({
    amount: Number,
    description: String,
    savedDate:String,
    username:String,
  });

//expense model data
const expense = mongoose.model("expense",expesnseData);

//moongoose contact form schema
const uExpense = new mongoose.Schema({
    amount: Number,
    description: String,
    savedDate:String,
    username:String,
  });

//expense model data
const userExpense = mongoose.model("userExpense",uExpense);

//moongoose contact form schema
const saveExpoToken = new mongoose.Schema({
    Dtoken: String,
  });

//expense model data
const expoToken = mongoose.model("expoToken",saveExpoToken);

//moongoose contact form schema
const deviceDetails = new mongoose.Schema({
    device_id: String,
    device_lat: Number,
    device_long: Number,
    userName:String
  });

//expense model data
const deviceLocations = mongoose.model("deviceLocations",deviceDetails);

//moongoose contact form schema
const newUser = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
  });

//expense model data
const user = mongoose.model("user",newUser);

app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/expense', async(req, res) => {
    const allData = await expense.find({});
    const allDatas = await expense.aggregate([
        {$group: { 
            _id: null,
             totalValue: {$sum: "$amount"}, 
             enabledValue: {$sum: {
                 $cond: [
                     // Condition to test 
                     {$eq: ["$enabled", "on"] },
                     // True
                     "$amount",
                     // False
                     0
                ] 
             }}
        }}
    ])
   
 
    return res.status(200).json({status: 'success', data: allData , sum: allDatas[0].totalValue});
});

app.post('/getExpenses',async (req, res) =>{
    try{
        const { description1 , amount1 ,savedate , userName} = req.body;


        const additemcategory = new expense({
            description:description1,
            amount:Number(amount1),
            savedDate:savedate,
            username:userName
        }).save().then(
            res.status(200).json({status: 'Success', msg: 'Data saved successfully'})
        )

    }
    catch(err){
        console.log(err);
    }
})

//user register
app.post('/userRegister',async (req, res) =>{
    try{
        const { email , password ,userName} = req.body;
        let ifEmail = await user.findOne({email:email});
        if(!ifEmail){
            const adddUser = new user({
                email:email,
                password:password,
                username:userName
            }).save().then(
                res.status(200).json({status: 'Success', msg: 'Data saved successfully', email:ifEmail})
            )
        }
        else{
             res.status(200).json({status:"failed" , msg:"User already registerd " , email:ifEmail})
            
        }

    }
    catch(err){
        console.log(err);
    }
})

//user register
app.post('/userLogin',async (req, res) =>{
    try{
        const { email , password} = req.body;

        let ifEmail = await user.findOne({email:email});

        if(!ifEmail){
            res.status(200).json({status:"failed" , msg:"User not registred"})
        }
        else if(ifEmail){
            if(password == ifEmail.password){
                res.status(200).json({status:"Success"  , msg:"user Login"})
            }
            else{
                res.status(200).json({status:"failed" , msg:"Incorrect password"})
            }
        }

    }
    catch(err){
        console.log(err);
    }
});


app.post('/userExpensesPOST',async (req, res) =>{
  try{
      const { description1 , amount1 ,savedate } = req.body;


      const addUserExpense = new userExpense({
          description:description1,
          amount:Number(amount1),
          savedDate:savedate,
      }).save().then(
          res.status(200).json({status: 'Success', msg: 'Data saved successfully'})
      )

  }
  catch(err){
      console.log(err);
  }
});


app.post('/getuserexpenses',async (req, res) =>{
  try{
    const getuserexpenses = await userExpense.find({});

    return res.status(200).json({status: 'success', data: getuserexpenses });
  }
  catch(err){
      console.log(err);
  }
})

app.post('/saveToken',async (req, res) =>{
    try{
        const { tokenNew } = req.body;

        const addToken = new expoToken({
          Dtoken:tokenNew,
        }).save().then(
            res.status(200).json({status: 'Success', msg: 'token added successfully'})
        )

    }
    catch(err){
        console.log(err);
    }
})

app.get('/getTokens',async (req, res) =>{
  try{
    const allTokens = await expoToken.find({});

    return res.status(200).json({status: 'success', data: allTokens });

  }
  catch(err){
      console.log(err);
  }
})

app.get(`/deleteExpense/:id`,async(req,res)=>{
    try {
        let dltId = req.params.id;
          const dltItem = await expense.findByIdAndDelete({ _id: dltId }).then(() => {
            res.status(200).json({status: 'success', msg: ' Data deleted successfully'});
        })
        
    } catch (error) {
        console.log(error);
    }

})


///get locations
app.post(`/postLocations`,async(req,res)=>{
    try{
        const { device_id , device_lat , device_long  , userName} = req.body;

        let ifDevice = await deviceLocations.findOne({device_id:device_id});

        if(!ifDevice){
            const addToken = new deviceLocations({
                device_id: device_id,
                device_lat: device_lat,
                device_long: device_long,
                userName:userName
    
                }).save().then(
                    res.status(200).json({status: 'Success', msg: 'token added successfully'})
                )
        }
        else{
            const newLocations = await deviceLocations.updateOne(
                { device_id: device_id, },
                {
                    $set: {
                        device_lat: device_lat,
                        device_long: device_long,
                        userName:userName
                    },
                }
            ).then(() => {
                return res.status(200).json({status: 'Success', msg: 'location updated successfully'})
            });
        }
    }
    catch(err){
        console.log(err);
    }
})

app.post('/updateLocations',async(req,res)=>{
    const { device_id , device_lat , device_long  , userName} = req.body;

    const newLocations = await deviceLocations.updateOne(
        { device_id: device_id, },
        {
            $set: {
                device_lat: device_lat,
                device_long: device_long,
                userName:userName
            },
        }
    ).then(() => {
        return res.status(200).json({status: 'Success', msg: 'location added successfully'})
    });
})


///get locations
app.get(`/getLocations`,async(req,res)=>{
    try{
        const allLocations = await deviceLocations.find({});

         return res.status(200).json({status: 'success', data: allLocations });

    }
    catch(err){
        console.log(err);
    }
})

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log('Server running on port' +  " " + PORT);
});
