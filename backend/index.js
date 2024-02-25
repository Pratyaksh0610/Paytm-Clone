const { User } = require("./db");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
app.use(express.json());

app.post("/signup", async function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const user = new User({
    firstName: firstName,
    lastName: lastName,
    password: password,
  });
  await user.save();
  res.status(200).json({
    msg: "Saved Successfully",
  });
});

app.get("/signin", async function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const user = await User.find({
    firstName: firstName,
    lastName: lastName,
    password: password,
  });
  if (user) {
    console.log(user);
    res.status(200).json({
      msg: "User found",
    });
  } else {
    res.status(200).json({
      msg: "User not found",
    });
  }
});

app.put("/update", async function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const newfirstName = req.body.newfirstName;
  const newlastName = req.body.newlastName;
  const newpassword = req.body.newpassword;
  const user = await User.find({
    firstName: firstName,
    lastName: lastName,
    password: password,
  });
  if (user) {
    const id = user[0]._id;
    await User.updateOne(
      { _id: id },
      {
        firstName: newfirstName,
        lastName: newlastName,
        password: newpassword,
      }
    );
    res.status(200).json({
      msg: "Updated Successfully",
    });
  } else {
    res.status(200).json({
      msg: "Not updated",
    });
  }
});

app.listen(port, () => {
  console.log("Started listening at " + port);
});
