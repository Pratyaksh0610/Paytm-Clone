const express = require("express");
const { userRouter } = require("./user");
const { accountRouter } = require("./account");
const app = express();

const apiRouter = express.Router();

console.log("Inside apiRouter");

apiRouter.use("/user", userRouter);
apiRouter.use("/account", accountRouter);

module.exports = {
  apiRouter,
};
