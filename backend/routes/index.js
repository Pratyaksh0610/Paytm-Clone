const express = require("express");
const { userRouter } = require("./user");
const app = express();

const apiRouter = express.Router();

console.log("Inside apiRouter");

apiRouter.use("/user", userRouter);

module.exports = {
  apiRouter,
};
