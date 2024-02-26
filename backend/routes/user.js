const express = require("express");
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const authMiddleware = require("./middleware");

console.log("Inside userRouter");

const userRouter = express.Router();

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

userRouter.post("/signup", async function (req, res) {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Incorrect inputs",
    });
  }
  // const username = req.body.username;
  // const firstName = req.body.firstName;
  // const lastName = req.body.lastName;
  // const password = req.body.password;
  // const valid = zod.string();
  // const fparsed = valid.safeParse(firstName);
  // const lparsed = valid.safeParse(lastName);
  // const passparsed = valid.safeParse(password);
  // if (!fparsed.success || !lparsed.success || !passparsed.success) {
  //   res.status(400).json({
  //     msg: "Invalid Input",
  //   });
  //   return;
  // }

  const existingUser = await User.findOne({ username: req.body.username });

  if (existingUser) {
    res.status(411).json({
      msg: "Email already taken",
    });
    return;
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = user._id;
  // // const user = new User(userData);
  // let id = 0;
  // //   console.log(JWT_SECRET);
  // await user.save().then((savedUser) => {
  //   id = savedUser._id;
  // });
  const userAccount = new Account({
    userId: userId,
    balance: Math.floor(Math.random() * 1e5),
    lock: false,
  });

  const payload = {
    userId: userId,
    exp: Math.floor(Date.now() / 1000) + 30 * 60,
  };

  await userAccount.save();
  const token = jwt.sign(payload, JWT_SECRET);
  res.status(200).json({
    msg: "User created Successfully",
    token: token,
  });
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

userRouter.post("/signin", async function (req, res) {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const payload = {
      userId: user._id,
      exp: Math.floor(Date.now() / 1000) + 30 * 60,
    };
    const token = jwt.sign(payload, JWT_SECRET);

    res.json({
      token: token,
    });
    return;
  }

  res.status(411).json({
    message: "Error while logging in",
  });
  // const firstName = req.body.firstName;
  // const lastName = req.body.lastName;
  // const password = req.body.password;
  // const userData = {
  //   firstName: firstName,
  //   lastName: lastName,
  //   password: password,
  // };
  // const existingUser = await User.find(userData);
  // if (existingUser) {
  //   let id = existingUser[0]._id;
  //   console.log(id);
  //   const token = jwt.sign({ userId: id }, JWT_SECRET);
  //   res.status(200).json({
  //     token: token,
  //   });
  // } else {
  //   res.status(400).json({
  //     msg: "Error while logging in",
  //   });
  // }
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

userRouter.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    message: "Updated successfully",
  });
});

userRouter.get("/bulk", async function (req, res) {
  const filter = req.query.filter || "";
  // const lName = req.query.filter || "";
  const users = await User.find({
    $or: [{ firstName: filter }, { lastName: filter }],
  });
  res.status(200).json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = {
  userRouter,
};
