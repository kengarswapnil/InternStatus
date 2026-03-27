import {
  getUserNotificationsService,
  getUnreadCountService,
  markNotificationReadService,
  markAllNotificationsReadService
} from "./users.service.js";


export const getMyProfile = async (req, res) => {
  try {

    const user = req.user;

    let profile = null;

    if (user.referenceModel && user.referenceId) {

      const Model = (await import(`../../models/${user.referenceModel}.js`)).default;

      profile = await Model.findById(user.referenceId);
    }

    res.json({
      user,
      profile
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};



// ---------------- GET LIST ----------------
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const data = await getUserNotificationsService({
      userId,
      page: Number(page),
      limit: Number(limit)
    });

    res.json({ success: true, ...data });

  } catch (err) {
    console.error("getUserNotifications:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- UNREAD COUNT ----------------
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const data = await getUnreadCountService(userId);

    res.json({ success: true, ...data });

  } catch (err) {
    console.error("getUnreadCount:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- MARK ONE ----------------
export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const data = await markNotificationReadService(id, userId);

    res.json({ success: true, data });

  } catch (err) {
    console.error("markNotificationRead:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- MARK ALL ----------------
export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await markAllNotificationsReadService(userId);

    res.json({ success: true });

  } catch (err) {
    console.error("markAllNotificationsRead:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};