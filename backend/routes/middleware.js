const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ msg: "Something is wrong with token" });
  }

  const token = authHeader.split(" ")[1];
  // console.log(token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    // console.log(decoded);

    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ msg: "Error in token or token expired" });
  }
};

module.exports = authMiddleware;
