import { Wallet } from "./wallet";
import { Investments } from "./investments";
import { Payments } from "./payments";
import {Maximize} from "./maximize"
import {Minimize} from "./minimize"
export const SidebarIcons = {
  Wallet,
  Investments,
  Payments,
  Maximize,
  Minimize,
};

export type IconType = keyof typeof SidebarIcons;
