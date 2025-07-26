"use client";
import React, { useCallback, useState } from "react";
import { IconType, ProfileIcons } from "./icons";
import { Copied } from "./icons/copied";

type LinkProps = {
  id: string;
  title: string;
  content: string;
  icon: IconType;
  separator: boolean;
  showContent: boolean;
};

function ProfileButtons({
  id,
  title,
  content,
  icon,
  separator,
  showContent,
}: LinkProps) {
  const Icon = ProfileIcons[icon];

  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    if (typeof window === "undefined" || !navigator?.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [content]);

  if (separator) {
    return (
      <>
        <button
          id={id}
          onClick={copyToClipboard}
          className="flex flex-col  gap-2 w-full"
        >
          <div className="flex flex-row justify-between items-start w-[60%]">
            <span className="text-[9px] text-[#64748B] lg:text-[10px]">
              {title}
            </span>
            {copied ? <Copied /> : <Icon />}
          </div>
          <span className="text-[9px] text-[#1E293B] font-semibold text-left w-full lg:text-[10px]">
            {showContent ? content : ""}
          </span>
        </button>
        <hr className="-ml-7 w-12 rotate-90" />
      </>
    );
  }

  return (
    <>
      <button
        id={id}
        onClick={copyToClipboard}
        className="flex flex-col justify-start items-center gap-2 w-44"
      >
        <div className="flex flex-row gap-2 items-start justify-start min-w-full">
          <span className="text-[9px] text-[#64748B] lg:text-[10px]">
            {title}
          </span>
          {copied ? <Copied /> : <Icon />}
        </div>
        <span className="text-[9px] text-[#1E293B] font-semibold text-left w-full lg:text-[10px]">
          {showContent ? content : ""}
        </span>
      </button>
    </>
  );
}

export default ProfileButtons;
