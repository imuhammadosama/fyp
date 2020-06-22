import isAdmin from "./admin.middleware";
import isMember from "./member.middleware";
import isDriver from "./driver.middleware";

const passport = require("passport");

const isLoggedIn = passport.authenticate("jwt", { session: false });

export { isLoggedIn, isMember, isDriver, isAdmin };
