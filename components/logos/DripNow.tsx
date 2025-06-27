import { SVGAttributes } from "react";
import { useId } from "react";

export type DripNowLogoProps = SVGAttributes<SVGSVGElement>;

export default function DripNowLogo(props: DripNowLogoProps) {
  const id = useId();

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient
          id={`dripnow-logo-gradient-${id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      
      {/* Stylized drop icon */}
      <path
        d="M12 3C9.5 6.5 4 11.5 4 15.5C4 19.09 7.58 22 12 22C16.42 22 20 19.09 20 15.5C20 11.5 14.5 6.5 12 3Z"
        fill={`url(#dripnow-logo-gradient-${id})`}
        stroke="currentColor"
        strokeWidth="0.5"
      />
      
      {/* Eye symbol (representing color vision aid) */}
      <circle cx="12" cy="14" r="2.5" fill="white" />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}
