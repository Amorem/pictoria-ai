"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LucideCreditCard,
  LucideFrame,
  LucideImage,
  LucideLayers,
  LucideSettings2,
  LucideSquareTerminal,
} from "lucide-react";

export function NavMain() {
  const pathname = usePathname();
  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LucideSquareTerminal,
    },
    {
      title: "Generate Image",
      url: "/image-generation",
      icon: LucideImage,
    },
    {
      title: "My Models",
      url: "/models",
      icon: LucideFrame,
    },
    {
      title: "Train Model",
      url: "/model-training",
      icon: LucideLayers,
    },
    {
      title: "My Images",
      url: "/gallery",
      icon: LucideImage,
    },
    {
      title: "Billing",
      url: "/billing",
      icon: LucideCreditCard,
    },
    {
      title: "Settings",
      url: "/account-settings",
      icon: LucideSettings2,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              "rounded-none",
              pathname === item.url
                ? "text-primary bg-primary/5"
                : "text-muted-foreground"
            )}
          >
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
