import React from "react";
import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export function Maximize({ color = "currentColor", ...props }: Props) {
  return (
    <svg
      width="20"
      height="12"
      viewBox="0 0 20 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 0.75V11.25C20 11.6875 19.6562 12 19.25 12C18.8125 12 18.5 11.6875 18.5 11.25V0.75C18.5 0.34375 18.8125 0 19.25 0C19.6562 0 20 0.34375 20 0.75ZM15.7812 5.46875C16.0625 5.78125 16.0625 6.25 15.7812 6.53125L11.5312 10.7812C11.2188 11.0938 10.75 11.0938 10.4688 10.7812C10.1562 10.5 10.1562 10.0312 10.4688 9.75L13.4375 6.78125L0.75 6.75C0.3125 6.75 0 6.4375 0 6C0 5.59375 0.3125 5.25 0.75 5.25H13.4375L10.4688 2.28125C10.1562 2 10.1562 1.53125 10.4688 1.25C10.75 0.9375 11.2188 0.9375 11.5312 1.25L15.7812 5.46875Z"
        fill={color}
      />
    </svg>
  );
}
