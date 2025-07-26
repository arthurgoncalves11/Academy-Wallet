import { Copy } from "./copy";
import { Logout } from "./logout";

export const ProfileIcons = {
  Copy,
  Logout
};

export type IconType = keyof typeof ProfileIcons;
