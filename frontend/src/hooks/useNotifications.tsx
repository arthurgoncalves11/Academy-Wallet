import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  seen: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchNotifications = useCallback(async () => {
    try {
      console.log(`URL: ${process.env.NEXT_PUBLIC_API_URL}/notification`);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notification`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.status);
      if (!response.ok && response.status !== 401)
        throw new Error("Failed to fetch notifications");

      const { data } = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const markAsSeen = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notification/mark-as-seen`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ notificationId }),
          }
        );

        if (!response.ok)
          throw new Error("Failed to mark notification as seen");

        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, seen: true }
              : notification
          )
        );
      } catch (error) {
        console.error("Error marking notification as seen:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token, fetchNotifications]);

  return {
    notifications,
    loading,
    markAsSeen,
    refetchNotifications: fetchNotifications,
  };
};
