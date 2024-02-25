const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://pratyaksh06:facebook123@cluster0.ngnfrai.mongodb.net/paytm"
);

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: String,
});

const User = mongoose.model("user", UserSchema);

module.exports = {
  User,
};
