const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const app = express();
console.log("Inside userRouter");

const userRouter = express.Router();

userRouter.post("/signup", async function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const valid = zod.string();
  const fparsed = valid.safeParse(firstName);
  const lparsed = valid.safeParse(lastName);
  const passparsed = valid.safeParse(password);
  if (!fparsed.success || !lparsed.success || !passparsed.success) {
    res.status(400).json({
      msg: "Invalid Input",
    });
    return;
  }
  const userData = {
    firstName: firstName,
    lastName: lastName,
    password: password,
  };
  const existingUser = await User.findOne(userData);

  if (existingUser) {
    res.status(400).json(existingUser);
    return;
  }
  const user = new User(userData);
  let id = 0;
  //   console.log(JWT_SECRET);
  await user.save().then((savedUser) => {
    id = savedUser._id;
  });
  const signed_id = jwt.sign({ id: id }, JWT_SECRET);
  res.status(200).json({
    msg: "Saved Successfully",
    token: signed_id,
  });
});

userRouter.post("/signin", async function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const userData = {
    firstName: firstName,
    lastName: lastName,
    password: password,
  };
  const existingUser = await User.find(userData);
  if (existingUser) {
    let id = existingUser[0]._id;
    console.log(id);
    const token = jwt.sign({ id: id }, JWT_SECRET);
    res.status(200).json({
      token: token,
    });
  } else {
    res.status(400).json({
      msg: "Error while logging in",
    });
  }
});

module.exports = {
  userRouter,
};
