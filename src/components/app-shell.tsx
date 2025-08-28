
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  Calendar,
  CreditCard,
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
  Warehouse,
  LogOut
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";


const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/schedule", icon: Calendar, label: "Schedule" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/invoices", icon: FileText, label: "Invoices" },
  { href: "/payments", icon: CreditCard, label: "Payments" },
  { href: "/inventory", icon: Warehouse, label: "Inventory" },
];

function ContractorOSLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M12 18v-6" />
          <path d="M9 15h6" />
        </svg>
      </div>
      <span className="font-headline text-lg font-bold">ContractorOS</span>
    </Link>
  );
}

function UserMenu() {
  const { user, customClaims, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={user.photoURL || "https://picsum.photos/100"} alt={user.displayName || user.email || 'User'} data-ai-hint="user avatar"/>
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {customClaims?.role} on {customClaims?.companyId}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MainNav() {
  const pathname = usePathname();
  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname.startsWith(item.href)}
              icon={<item.icon />}
              tooltip={item.label}
            >
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user && !pathname.startsWith('/login') && !pathname.startsWith('/accept-invite')) {
      router.push('/login');
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-lg">Loading...</div>
        </div>
    )
  }
  
  if (!user && !pathname.startsWith('/login') && !pathname.startsWith('/accept-invite')) {
    return null; // or a loading spinner
  }

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="border-r"
        variant="sidebar"
        side="left"
      >
        <SidebarHeader className="hidden items-center justify-between p-4 md:flex">
          <ContractorOSLogo />
        </SidebarHeader>
        <div className="flex-1 overflow-y-auto">
          <MainNav />
        </div>
        <SidebarFooter className="hidden md:flex p-2">
          <Link href="/settings">
            <SidebarMenuButton
              isActive={pathname.startsWith("/settings")}
              icon={<Settings />}
              tooltip="Settings"
            >
              <span>Settings</span>
            </SidebarMenuButton>
          </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:justify-end">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div className="md:hidden">
            <ContractorOSLogo />
          </div>
          <UserMenu />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
      <Link href="/jobs/new">
        <Button size="xl" className="fixed bottom-6 right-6 z-20 rounded-full shadow-lg [&_svg]:size-6">
          <Plus />
          <span className="sr-only">New Job</span>
        </Button>
      </Link>
    </SidebarProvider>
  );
}
