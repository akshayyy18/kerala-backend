const jwt = require("jsonwebtoken");
const secretKey = "vgfuvnkjdxv";

exports.authorization = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "token not found" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verify = jwt.verify(token, secretKey);
    req.user = verify;

    // console.log(verify)
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "invalid token", error: error.message });
  }
};
