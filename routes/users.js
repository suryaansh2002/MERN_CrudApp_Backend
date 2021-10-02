const express = require("express");
const router = express.Router();
const Users = require("../models/User");

const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwt_decode = require("jwt-decode");

const JWT_SECRET = "fnvopedbjirpni[tink[trnk[ob[s&%**%%dlbkjrdkf";



router.get('/', (req,res)=>{
    try{
        
        res.json({message: "Welcome to user"});
    }
    catch(err){
        console.log(err)

        res.json({ message: err })
    }

})


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || typeof email !== "string" || email.indexOf("@") == -1) {
    return res.json({ status: "error", error: "Invalid Email" });
  }
  if (!password || typeof password !== "string") {
    return res.json({ status: "error", error: "Invalid Password" });
  }

  const user = await Users.findOne({ email }).lean();

  if (!user) {
    return res.json({
      status: "error",
      error: "User does not exist!",
      data: "",
    });
  } else {
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        JWT_SECRET
      );
      var payload = jwt_decode(token);

      return res.json({ status: "success", error: "", data: payload });
    } else {
      return res.json({
        status: "error",
        error: "Incorrect Password",
        data: "",
      });
    }
  }
});
router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { username, email, password: plainTextPassword } = req.body;
  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    

    if (!username || typeof username !== "string") {
      return res.json({ status: "error", error: "Invalid Username" });
    }
      if (!email || typeof email !== "string" || email.indexOf("@") == -1) {
    return res.json({ status: "error", error: "Invalid Email" });
  }

    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.json({ status: "error", error: "Invalid Password" });
    }
    if (plainTextPassword.length < 6) {
      return res.json({
        status: "error",
        error: "Password should be atleast 6 characters long.",
      });
    }
    const response = await Users.create({
        username,
        email,
        password,
      });
    return res.json({ status: "success", error: "" });
  } catch (error) {
    if ((error.code = 11000)) {
      return res.json({ status: "error", error: "Email ID already used." });
    }
    throw error;
  }
});

//Get A Single Post By Id
module.exports = router;
