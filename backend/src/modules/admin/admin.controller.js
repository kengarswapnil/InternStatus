// controllers/admin.controller.js

export const getAdminDashboard = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        message: "Admin dashboard working"
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};