const express = require("express");
const cors = require("cors");
const { router } = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.listen(3000, () => {
  console.log("Started listening at port 3000");
});
