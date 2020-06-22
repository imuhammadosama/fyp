const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user.role === "Admin") return next();
  res.sendStatus(403);
};

export default isAdmin;
