let notificationId = 0;

export function createNotification({ title, message, patientName, type = "info", appointmentId }) {
  if (typeof window === "undefined") return null;

  const notification = {
    id: ++notificationId,
    title,
    message,
    patientName,
    type,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    read: false,
    appointmentId,
  };

  const existing = JSON.parse(localStorage.getItem("juwon:notifications") || "[]");
  existing.unshift(notification);
  localStorage.setItem("juwon:notifications", JSON.stringify(existing));

  window.dispatchEvent(new CustomEvent("juwon:notification", { detail: notification }));

  return notification;
}

export function loadNotifications() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("juwon:notifications") || "[]");
}

export function markAsRead(id) {
  if (typeof window === "undefined") return;
  const all = loadNotifications();
  const idx = all.findIndex((n) => n.id === id);
  if (idx !== -1) {
    all[idx].read = true;
    localStorage.setItem("juwon:notifications", JSON.stringify(all));
  }
  window.dispatchEvent(new CustomEvent("juwon:notification-update"));
}

export function markAllAsRead() {
  if (typeof window === "undefined") return;
  const all = loadNotifications();
  all.forEach((n) => (n.read = true));
  localStorage.setItem("juwon:notifications", JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("juwon:notification-update"));
}

export function clearNotifications() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("juwon:notifications");
  window.dispatchEvent(new CustomEvent("juwon:notification-update"));
}
