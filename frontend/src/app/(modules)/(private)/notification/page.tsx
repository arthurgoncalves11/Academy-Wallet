"use client";

import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNotifications } from "@/hooks/useNotifications";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import { useEffect } from "react";

interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  seen: boolean;
}

export default function Page() {
  const { notifications, loading, markAsSeen } = useNotifications();

  useEffect(() => {
    if(loading || !notifications.length) return;

    const unreadNotifications = notifications.filter(notification => !notification.seen);
    if (!unreadNotifications.length) return;

    const timers = unreadNotifications.map(notification => {
      return setTimeout(() => {
        if(!notification.seen) {
          markAsSeen(notification.id)
        }
      }, 5000);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  
  }, [notifications, loading, markAsSeen])


  const adjustDateTime = (dateString: string): Date => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 3);
    return date;
  };

  const groupNotificationsByDate = (notifications: Notification[]): { [key: string]: Notification[] } => {
    return notifications.reduce((groups, notification) => {
 
      const adjustedDate = adjustDateTime(notification.createdAt);
      
      const date = formatInTimeZone(
        adjustedDate,
        'America/Sao_Paulo',
        'dd \'de\' MMMM',
        { locale: ptBR }
      );
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {} as { [key: string]: Notification[]});
  };

  if (loading) {
    return (
      <div className="h-full border border-lightGray rounded-3rem bg-white mt-5 mx-10 px-6 pt-3">
        <h1 className="font-semibold text-base text-[#1E293B] py-2">
          Carregando notificações...
        </h1>
      </div>
    );
  }

  const groupedNotifications = groupNotificationsByDate(notifications);


  const formatTime = (dateString: string) => {
    // Ajusta o horário adicionando 3 horas
    const adjustedDate = adjustDateTime(dateString);
    
    return formatInTimeZone(
      adjustedDate,
      'America/Sao_Paulo',
      'HH:mm',
      { locale: ptBR }
    );
  };

  return (
    <div className="h-full border border-lightGray rounded-3rem bg-white mt-5 mx-10 px-6 pt-3">
      <h1 id="title" className="font-semibold text-base text-[#1E293B] py-2">
        Notificações
      </h1>
      <div className="mt-4">
        {Object.entries(groupedNotifications).map(([date, dayNotifications]) => (
          <div key={date}>
            <div className="mb-4 w-fit h-7 flex items-center bg-[#F8FAFC] border border-[#F1F5F9] rounded-[50px] py-2 px-3">
              <p className="text-xs font-semibold text-[#1E293B]">
                {date}
              </p>
            </div>

            {dayNotifications.map((notification) => (
              <div
                key={notification.id}
                className="container-not flex justify-between items-center border-b border-[#F1F5F9] pb-3"
                onClick={() => !notification.seen && markAsSeen(notification.id)}
              >
                <div className="mt-3">
                  <p className="text-xs font-semibold text-[#1E293B] mb-1">
                    {notification.title}
                  </p>
                  <p className="text-xs font-normal text-[#64748B]">
                    {notification.description}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className={`text-xs font-normal text-[#64748B] ${notification.seen ? "mr-3" : 'mr-2'}`}>
                    {formatTime(notification.createdAt)}
                  </p>
                  {!notification.seen && (
                    <span className="flex items-start min-w-2 max-w-2">
                      <FontAwesomeIcon
                        icon={faCircle}
                        className="text-[8px] text-[#FF015C] align-middle"
                      />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}