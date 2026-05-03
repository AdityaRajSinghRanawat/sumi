import React from "react";
import { Link } from "react-router-dom";

type BorderMagicLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  colors?: string[];
};

export const BorderMagicLink = ({
  to,
  children,
  className = "",
  ariaLabel,
  colors = ["#eff6ff", "#60a5fa", "#3b82f6", "#8b5cf6", "#eff6ff"],
}: BorderMagicLinkProps) => {
  const gradient = `conic-gradient(from 90deg at 50% 50%,${colors[0]} 0%,${colors[1]} 18%,${colors[2]} 42%,${colors[3]} 68%,${colors[4]} 100%)`;

  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={`relative inline-flex h-14 overflow-hidden rounded-full p-px focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-950 ${className}`}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]" style={{ background: gradient }} />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-2 text-lg font-medium text-white backdrop-blur-3xl font-dx-grafik">
        {children}
      </span>
    </Link>
  );
};

export default BorderMagicLink;