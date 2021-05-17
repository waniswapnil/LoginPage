const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const router = express.Router();

require("../db/conn");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send(`Hello world im from router`);
});

// Promises
// router.post("/register", (req,res)=>{
//     const {name,email,password, cpassword} =  req.body

//     if(!name || !email || !password || !cpassword){
//         return res.status(422).json({error: "plz enter detail properly"});
//     }

//     User.findOne({email: email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({error: "Email already exist"});
//         }

//         const user = new User({name,email,password, cpassword});

//         user.save().then(()=>{
//             res.status(201).json({message: "User register successfully"});
//         }).catch((err)=> res.status(500).json({error: "Failed to register"}))

//     }).catch(err=>{console.log(err)})

// })

router.post("/register", async (req, res) => {
  const { name, email,phone, password, cpassword } = req.body;

  if (!name || !email || !phone || !password || !cpassword) {
    return res.status(422).json({ error: "plz enter detail properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password are not matching" });
    } else {
      const user = new User({ name, email,phone, password, cpassword });
      await user.save();
      res.status(201).json({ message: "User register successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/signIn", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
    const userLogin = await User.findOne({ email: email });

        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);

             token = await userLogin.generateAuthToken();
             console.log(token);
             res.cookie("jwtoken",token,{
               expires: new Date(Date.now()+25892000000),
               httpOnly: true
             });
            if(!isMatch){
                res.status(400).json({error: "Invalid credentials pass"});
            }else {
                res.json({message: "user SignIn Successfully"})
            }
        }
        else {
            res.status(400).json({error: "Invalid credentials"});
        }




  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
