import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import "../styles/components/NotificationBell.css";

interface Notification {
  id: number;
  message: string;
  isRead: boolean; // ⚡ old backend uses isRead
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;

  // ✅ Fetch notifications
  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      const res = await api.get(`/api/notifications/user/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  
  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [userId]);


  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 
  

  const handleToggle = async () => {
    const newState = !open;
    setOpen(newState);

    if (newState && userId) {
      try {
        await api.put(`/api/notifications/read-all/${userId}`);
        fetchNotifications(); 
        
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notification-bell" ref={bellRef}>
      <span className="bell-icon" onClick={handleToggle}>
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </span>

      {open && (
        <div className="notification-dropdown">
          {notifications.length === 0 && <p className="no-notifications">No notifications</p>}

          {notifications.map(n => (
            <div
              key={n.id}
              className={`notification-item ${n.isRead ? "" : "unread"}`}
            >
              <div className="message">{n.message}</div>
              <span className="time">{new Date(n.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}