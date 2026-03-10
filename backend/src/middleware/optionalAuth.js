import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Cookie
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Authorization header
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token → continue as guest
    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    // If user not found → treat as guest
    if (!user) {
      req.user = null;
      return next();
    }

    // Account inactive → treat as guest
    if (user.accountStatus !== "active") {
      req.user = null;
      return next();
    }

    // Attach user
    req.user = user;

    next();
  } catch (err) {
    // Invalid token → ignore and continue
    req.user = null;
    next();
  }
};