const isDriver = (req, res, next) => {
  const user = req.user;
  if (user.role == "Driver") return next();
  res.sendStatus(403);
};

export default isDriver;
