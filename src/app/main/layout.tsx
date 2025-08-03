'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  BarChartHorizontalBig,
  CalendarClock,
  LayoutDashboard,
  Send,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  {
    href: '/monthly-analysis',
    label: 'Monthly Analysis',
    icon: BarChartHorizontalBig,
  },
  {
    href: '/yearly-analysis',
    label: 'Yearly Analysis',
    icon: CalendarClock,
  },
];

function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <Button
          variant="ghost"
          className={cn(
            'h-12 justify-start gap-2 px-3 text-lg font-bold',
            state === 'collapsed' && 'h-12 w-12 justify-center px-0'
          )}
        >
          <Send className="h-6 w-6 text-primary" />
          <span
            className={cn(
              'transition-opacity duration-200',
              state === 'collapsed' ? 'opacity-0' : 'opacity-100'
            )}
          >
            ExpensePilot
          </span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:h-16 sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold">
                {navItems.find((item) => item.href === pathname)?.label ||
                  'Dashboard'}
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
