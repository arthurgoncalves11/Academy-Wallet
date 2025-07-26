import React from "react";
import { IconType, SidebarIcons } from "./icons";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { useRouter } from "next/navigation";

type LinkProps = {
  title: string;
  url: string;
  icon: IconType;
  collapsed: boolean;
};

function Link({ title, url, icon, collapsed }: LinkProps) {
  const Icon = SidebarIcons[icon];
  const { push } = useRouter();
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            id={title}
            onClick={() =>
              title !== "Maximizar" || "Minimizar" ? push(url) : ""
            }
            className="flex w-full h-9 items-center  justify-center"
          >
            <Icon name={icon} />
            <TooltipContent className="z-50 bg-white rounded-md text-black flex items-center justify-center p-2 ml-9 shadow-md absolute border-solid border-gray-400">
              <p>{title}</p>
            </TooltipContent>
          </button>
        </TooltipTrigger>
      </Tooltip>
    );
  }
  return (
    <button
      id={title}
      className="flex w-full h-9 items-center pl-3 gap-3"
      onClick={() => (title !== "Maximizar" || "Minimizar" ? push(url) : "")}
    >
      <Icon className="w-5" />
      <span>{title}</span>
    </button>
  );
}

export default Link;
