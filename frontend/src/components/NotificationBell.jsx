import React, { useEffect, useState } from "react";
import API from "../api/api";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔥 fetch unread count
  const fetchCount = async () => {
    try {
      const res = await API.get("/users/notifications/unread-count");
      setCount(res.data.count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/notifications?limit=5");
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const toggleDropdown = () => {
    setOpen(!open);
    if (!open) fetchNotifications();
  };

  const markAsRead = async (id) => {
    try {
      await API.patch(`/users/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
      fetchCount();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      {/* 🔔 Bell */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        🔔

        {count > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 rounded-full">
            {count}
          </span>
        )}
      </button>

      {/* 📩 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border z-50">
          <div className="p-3 border-b font-semibold text-sm">
            Notifications
          </div>

          {loading ? (
            <div className="p-4 text-sm text-gray-500">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">
              No notifications
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`p-3 text-sm border-b cursor-pointer hover:bg-gray-50 ${
                    !n.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="text-gray-600 text-xs mt-1">
                    {n.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;