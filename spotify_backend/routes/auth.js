const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helpers");

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName, username } = req.body;

  const user = await User.findOne({ email: email });

  //check if user alr exists
  if (user) {
    return res
      .status(403)
      .json({ error: "A User with this email already exists" });
  }
  //if doesnt exist crate new user

  const hashedPassword = bcrypt.hash(password, 10);
  const newUserData = {
    email,
    password: hashedPassword,
    firstName,
    lastName,
    username,
  };
  const newUser = await User.create(newUserData);

  // create a token for user id

  const token = await getToken(email, newUser);

  //return the result to user
  const userToReturn = { ...newUser.toJSON(), token };

  delete userToReturn.password;
  return res.status(200).json(userToReturn);
});
router.post("/login", async (req, res) => {
  // get email and pass from req.body
  const { email, password } = req.body;
  //check if user with email exists,if not then creds are wrong
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(403).json({ err: "Invalid Credentials" });
  }
  //if user exists, check for password,if not correct creds wrong again(hashpass stuff so complex)
  const isPassValid = await bcrypt.compare(password, user.password);//bcrypt.compare used to compare text password to hashed password

  if(!isPassValid){
        return res.status(403).json({ err: "Invalid Credentials" });
  }
  //if everthing is correct return a token to the user
  const token =await getToken(user.email,user);
  const userToReturn = { ...user.toJSON(), token };
    delete userToReturn.password;
  return res.status(200).json(userToReturn);
});


module.exports = router;
