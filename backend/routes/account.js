const express = require("express");
const authMiddleware = require("./middleware");
const { Account } = require("../db");

const accountRouter = express.Router();

accountRouter.get("/balance", authMiddleware, async function (req, res) {
  const id = req.userId;
  const userAccount = await Account.find({ userId: id });
  res.status(200).json({
    balance: userAccount.balance,
  });
});

accountRouter.post("/transfer", authMiddleware, async function (req, res) {
  const firstUserId = req.userId;
  const secondUserId = req.body.to;
  const transferAmount = req.body.amount;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Find sender's account and update balance
    const senderAccount = await Account.findOneAndUpdate(
      { userId: firstUserId },
      { $inc: { balance: -transferAmount } }, // Subtract amount from balance
      { new: true, session }
    );

    // Find receiver's account and update balance
    const receiverAccount = await Account.findOneAndUpdate(
      { accountNumber: secondUserId },
      { $inc: { balance: transferAmount } }, // Add amount to balance
      { new: true, session }
    );

    // If either account is not found, rollback the transaction
    if (!senderAccount || !receiverAccount) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({
        msg: "Either insufficient balance or accounts not found",
      });
      return;
      //   throw new Error("One or both accounts not found");
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return the updated accounts
    res.status(200).json({
      msg: "Transfer Successful",
    });
    return;
  } catch (error) {
    // If an error occurs, rollback the transaction and throw the error
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({
      msg: "Dikkat",
    });

    // throw error;
  }
});

module.exports = {
  accountRouter,
};
