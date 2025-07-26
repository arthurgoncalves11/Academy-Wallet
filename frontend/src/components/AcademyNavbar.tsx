"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Bell from "@/../public/bell-icon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";
import Profile from "./ui/profile/Profile";
import { initialsGenerator } from "./ui/profile/initialsGenerator";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationButton from "./NotificationButton";

interface AcademyNavbarProps {
  isOnBoarding: boolean;
  personName: string;
}

function AcademyNavbar({ isOnBoarding, personName }: AcademyNavbarProps) {
  const { push } = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileContainerRef.current &&
        !profileContainerRef.current.contains(event.target as Node) // verifica a div que você clicou é a mesma que a div referência
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const { notifications } = useNotifications();
  let unread = false;
  notifications.some((item) => {
    item.seen === false ? (unread = true) : "";
  });

  return (
    <nav className="w-full bg-[#000A1C] fixed z-10 h-16 flex justify-end pr-10">
      <div className="navbar-group flex items-center gap-4">
        <NotificationButton reload={unread}/>
        <div className="w-px bg-[#64748B] h-8" />
        <div
          ref={profileContainerRef}
          className="navbar-group flex items-center gap-4 relative"
        >
          <button
            className={`bg-[#FFFFFF1A] h-9 w-20 rounded-lg flex items-center justify-between hover:bg-[#ffffff75] z-20 ${
              isProfileOpen ? "bg-[#ffffff75]" : "hover:bg-[#ffffff75] "
            }first-step`}
            onClick={toggleProfile}
            id="open-profile"
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className="ml-3 text-white w-3"
            />
            <div className="w-10 h-9 bg-[#FFFFFF33] flex items-center justify-center text-white rounded-lg">
              {initialsGenerator(personName)}
            </div>
          </button>

          <Profile
            active={isOnBoarding ? true : isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
          />
        </div>
      </div>
    </nav>
  );
}

export default AcademyNavbar;
