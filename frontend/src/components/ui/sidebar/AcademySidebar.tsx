"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import AcademyLogo from "@/../public/academy-logo.svg";
import AcademyHat from "@/../public/academy-hat.svg";
import Image from "next/image";
import Link from "./Link";
import { IconType } from "./icons";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Carteira",
    url: "/wallet",
    icon: "Wallet",
  },
  {
    title: "Investimentos",
    url: "/investment",
    icon: "Investments",
  },
  {
    title: "Pagamentos",
    url: "/payment",
    icon: "Payments",
  },
];

export function AcademySidebar() {
  const { push } = useRouter();
  const { toggleSidebar, state } = useSidebar();
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" className="z-10 no-printme">
      <SidebarContent className="pt-4 no-printme">
        <SidebarGroup className="flex justify-center items-center">
          <Image
            src={AcademyLogo}
            alt="Logo AcademyWallet"
            width={192}
            height={27}
            className={`${
              state === "collapsed" ? "invisible" : "visible"
            } fixed mt-6 cursor-pointer`}
            id="academy-logo"
            onClick={() => push("/wallet")}
          />
          <Image
            src={AcademyHat}
            alt="Logo AcademyWallet"
            width={28}
            height={27}
            className={`${
              state !== "collapsed" ? "hidden" : "visible"
            } cursor-pointer`}
            id="academy-hat"
            onClick={() => push("/wallet")}
          />
        </SidebarGroup>
        <SidebarGroup className={`${state !== "collapsed" ? "mt-6" : ""}`}>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem
                onClick={toggleSidebar}
                className=" hover:bg-[rgba(255,255,255,0.1)] hover:text-white cursor-pointer rounded-sm flex items-center justify-center"
              >
                <SidebarTrigger />
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`${
                    pathname === item.url ? "bg-[#FFFFFF1A] text-white" : ""
                  } hover:bg-[rgba(255,255,255,0.1)] hover:text-white rounded-sm flex items-center justify-center`}
                >
                  <Link
                    title={item.title}
                    url={item.url}
                    icon={item.icon as IconType}
                    collapsed={state === "collapsed" ? true : false}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
