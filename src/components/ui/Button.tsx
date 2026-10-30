"use client";

import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "border-transparent bg-sys-primary text-sys-primary-text shadow-sys-sm hover:bg-sys-primary-hover",
  secondary: "border-sys-border bg-sys-bg-surface text-sys-text-base hover:bg-sys-bg-elevated",
  outline: "border-sys-border bg-transparent text-sys-text-base hover:border-sys-border-strong hover:bg-sys-bg-surface",
  ghost: "border-transparent bg-transparent text-sys-text-secondary hover:bg-sys-bg-elevated hover:text-sys-text-base",
  danger: "border-transparent bg-sys-text-danger text-sys-primary-text hover:bg-sys-text-danger/90",
  glass: "border-sys-media-border/20 bg-sys-media-bg/30 text-sys-media-text backdrop-blur-md hover:bg-sys-media-text/15 focus-visible:ring-sys-media-text/60 focus-visible:ring-offset-sys-media-bg",
} as const;

const sizes = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-sm",
  icon: "size-10 p-0",
} as const;

interface ButtonStyleProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
}

interface ButtonIcons {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

function buttonClassName({ variant = "primary", size = "md", className }: ButtonStyleProps) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sys-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-sys-bg-page disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0",
    variants[variant],
    sizes[size],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleProps, ButtonIcons {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, children, leadingIcon, trailingIcon, loading = false, disabled, type = "button", ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || props["aria-busy"]}
      className={buttonClassName({ variant, size, className })}
    >
      {loading ? (
        <LoaderCircle aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
      ) : leadingIcon ? (
        <span aria-hidden="true" className="inline-flex">{leadingIcon}</span>
      ) : null}
      {children}
      {!loading && trailingIcon && <span aria-hidden="true" className="inline-flex">{trailingIcon}</span>}
    </button>
  );
});

export type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & ButtonStyleProps & ButtonIcons;

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { variant, size, className, children, leadingIcon, trailingIcon, ...props },
  ref,
) {
  return (
    <Link {...props} ref={ref} className={buttonClassName({ variant, size, className })}>
      {leadingIcon && <span aria-hidden="true" className="inline-flex">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span aria-hidden="true" className="inline-flex">{trailingIcon}</span>}
    </Link>
  );
});
