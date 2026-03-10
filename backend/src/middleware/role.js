// 🔒 Authorize Based On Role
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Authentication required"
        });
      }

      const userRole = req.user.role;

      console.log("USER ROLE:", userRole);
      console.log("ALLOWED ROLES:", allowedRoles);

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: `Access denied for role: ${userRole}`
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Authorization error"
      });
    }
  };
};