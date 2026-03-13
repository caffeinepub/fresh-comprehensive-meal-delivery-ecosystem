import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChefHat, LogOut, Shield, Truck, User, Utensils } from "lucide-react";
import {
  clearCredentialSession,
  getCredentialSession,
} from "../lib/credentialAuth";

const ADMIN_PASSWORD_KEY = "fresh_admin_password_auth";

interface HeaderProps {
  userType: "customer" | "admin" | "delivery" | "restaurant";
}

export default function Header({ userType }: HeaderProps) {
  const credSession = getCredentialSession();
  const guestRaw = localStorage.getItem("fresh_guest_session");
  let guestSession: { name: string } | null = null;
  try {
    guestSession = guestRaw ? JSON.parse(guestRaw) : null;
  } catch {
    // ignore
  }
  const adminPasswordAuth = localStorage.getItem(ADMIN_PASSWORD_KEY) === "true";

  const isAuthenticated = !!credSession || !!guestSession || adminPasswordAuth;

  const handleLogout = () => {
    clearCredentialSession();
    localStorage.removeItem("fresh_guest_session");
    localStorage.removeItem(ADMIN_PASSWORD_KEY);
    window.location.reload();
  };

  const getRoleIcon = () => {
    switch (userType) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "delivery":
        return <Truck className="h-4 w-4" />;
      case "restaurant":
        return <ChefHat className="h-4 w-4" />;
      default:
        return <Utensils className="h-4 w-4" />;
    }
  };

  const getRoleLabel = () => {
    switch (userType) {
      case "admin":
        return "Admin Dashboard";
      case "delivery":
        return "Delivery Partner";
      case "restaurant":
        return "Restaurant Partner";
      default:
        return "Customer";
    }
  };

  let displayName = "";
  if (adminPasswordAuth) {
    displayName = "Admin";
  } else if (credSession) {
    displayName = credSession.name;
  } else if (guestSession) {
    displayName = `${guestSession.name} (Guest)`;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/fresh-logo.dim_200x200.png"
            alt="Fresh Logo"
            className="h-10 w-10"
          />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-fresh-600 to-fresh-500 bg-clip-text text-transparent">
              Fresh
            </h1>
            {isAuthenticated && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {getRoleIcon()}
                {getRoleLabel()}
              </p>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2"
                data-ocid="header.dropdown_menu"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {adminPasswordAuth
                      ? "admin"
                      : (credSession?.role ?? "guest")}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-2 text-destructive focus:text-destructive"
                data-ocid="header.logout.button"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
