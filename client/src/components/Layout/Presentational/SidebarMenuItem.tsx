"use client";

import { SidebarButton } from "./SidebarButton";

interface Props {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export function SidebarMenuItem({ icon, label, href }: Props) {
  return <SidebarButton icon={icon} label={label} href={href} />;
}
