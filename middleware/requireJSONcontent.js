const requireJsonContent = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    const err = new Error("Not json");
    // res.status(400).send("Server wants application/json!");
    err.statusCode = 400;
    next(err);
  } else {
    next();
  }
};

module.exports = requireJsonContent;
