import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useOtpAuth } from "../hooks/useOtpAuth";

interface AccessDeniedProps {
  appName: string;
}

export default function AccessDenied({ appName }: AccessDeniedProps) {
  const { logout } = useOtpAuth();
  const { clear } = useInternetIdentity();

  const handleLogout = () => {
    logout();
    clear();
    // Clear locally stored profile so fresh login can proceed
    localStorage.removeItem("userProfile");
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 via-background to-red-100/40 p-6"
      data-ocid="access_denied.panel"
    >
      <div className="flex max-w-sm flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <ShieldX className="h-10 w-10 text-red-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            This account doesn&apos;t have access to the{" "}
            <strong>{appName}</strong> app.
          </p>
          <p className="text-sm text-muted-foreground">
            Please log in with the correct account or contact support.
          </p>
        </div>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full"
          data-ocid="access_denied.primary_button"
        >
          Log Out &amp; Switch Account
        </Button>
      </div>
    </div>
  );
}
