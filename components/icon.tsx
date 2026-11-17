import type { SVGProps } from "react";

type IconName = "arrow" | "search" | "bag" | "user" | "menu" | "close" | "paw" | "science" | "heart" | "check";
const paths: Record<Exclude<IconName, "paw">, string> = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  search: "M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  bag: "M5 7h14l1 14H4L5 7Zm3 0V6a4 4 0 0 1 8 0v1",
  user: "M20 21a8 8 0 0 0-16 0M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m6 6 12 12M6 18 18 6",
  science: "M9 3h6M10 3v7L4 20c-.3.5 0 1 1 1h14c1 0 1.3-.5 1-1l-6-10V3M7 15h10",
  heart: "M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  check: "m5 12 4 4L19 6",
};

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {name === "paw" ? <><ellipse cx="6" cy="8" rx="2" ry="3" /><ellipse cx="11" cy="5" rx="2" ry="3" /><ellipse cx="17" cy="7" rx="2" ry="3" /><ellipse cx="21" cy="12" rx="1.5" ry="2.5" /><path d="M5 18c0-3 3-7 6-7s7 5 7 8-4 1-6 1-7 2-7-2Z" /></> : <path d={paths[name]} />}
  </svg>;
}
