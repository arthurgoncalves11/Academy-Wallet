import React from "react";
import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export function Copied({ color = "#64748B", ...props }: Props) {
  return (
    <svg
      width="11"
      height="9"
      viewBox="0 0 11 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.7691 0.676147C11.076 0.99353 11.076 1.50896 10.7691 1.82634L4.48337 8.32634C4.17645 8.64373 3.67801 8.64373 3.37109 8.32634L0.228237 5.07634C-0.078683 4.75896 -0.078683 4.24353 0.228237 3.92615C0.535156 3.60876 1.03359 3.60876 1.34051 3.92615L3.92846 6.59978L9.65926 0.676147C9.96618 0.358765 10.4646 0.358765 10.7715 0.676147H10.7691Z"
        fill={color}
      />
    </svg>
  );
}
