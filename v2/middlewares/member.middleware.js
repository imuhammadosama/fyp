const isMember = (req, res, next) => {
  const user = req.user;
  if (user.role == "Member") return next();
  res.sendStatus(403);
};

export default isMember;
