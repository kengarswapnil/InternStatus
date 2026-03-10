import mongoose from "mongoose";
import * as adminUserService from "./admin.users.service.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─────────────────────────────────────────────
// GET /api/admin/users
// ─────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      role = "",
      status = "",
      isVerified = "",
      isRegistered = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filters = {
      page: Math.max(1, parseInt(page)),
      limit: Math.min(100, Math.max(1, parseInt(limit))),
      search: search.trim(),
      role,
      status,
      isVerified,
      isRegistered,
      sortBy,
      sortOrder,
    };

    const result = await adminUserService.getAllUsers(filters);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[Admin] getAllUsers error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// GET /api/admin/users/:id
// ─────────────────────────────────────────────
export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const result = await adminUserService.getUserDetails(id);

    if (!result) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("[Admin] getUserDetails error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// PATCH /api/admin/users/:id/status
// ─────────────────────────────────────────────
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountStatus } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const allowed = ["active", "suspended", "deleted"];
    if (!accountStatus || !allowed.includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        message: `accountStatus must be one of: ${allowed.join(", ")}`,
      });
    }

    const updated = await adminUserService.updateUserStatus(id, accountStatus);

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("[Admin] updateUserStatus error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// POST /api/admin/users/:id/resend-invite
// ─────────────────────────────────────────────
export const resendInvite = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const result = await adminUserService.resendInvite(id);

    if (result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }

    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    console.error("[Admin] resendInvite error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// PATCH /api/admin/users/:id/profile
// ─────────────────────────────────────────────
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const result = await adminUserService.updateUserProfile(id, req.body);

    if (!result) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("[Admin] updateUserProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};