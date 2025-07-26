import { useNotifications } from "@/hooks/useNotifications";
import Bell from "@/../public/bell-icon.svg";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import Image from "next/image";
interface NotificationButtonProps {
  reload: boolean;
}
function NotificationButton({ reload }: NotificationButtonProps) {
  const pathname = usePathname();
  const { push } = useRouter();
  const { notifications, loading, refetchNotifications } = useNotifications();
  useEffect(() => {
    refetchNotifications();
  }, [pathname]);
  const hasUnreadNotifications = useMemo(() => {
    if (loading || !notifications || notifications.length === 0) return false;
    return notifications.some((notification) => !notification.seen);
  }, [notifications, loading]);

  return (
    <button
      className={`bg-[#FFFFFF1A] h-9 w-9 rounded-lg flex items-center justify-center relative ${
        pathname === "/notification" ? "bg-[#ffffff75]" : "hover:bg-[#ffffff75]"
      }`}
      onClick={() => push("/notification")}
      id="notification-button"
    >
      {" "}
      <Image
        src={Bell}
        className="text-white"
        alt="Ícone de notificação"
      />{" "}
      {hasUnreadNotifications && (
        <div className="bg-[#FF015C] rounded-[50%] h-2 w-2 absolute -top-1 -right-1"></div>
      )}{" "}
    </button>
  );
}
export default NotificationButton;
