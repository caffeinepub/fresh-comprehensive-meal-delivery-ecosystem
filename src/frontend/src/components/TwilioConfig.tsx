import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { TwilioConfiguration } from "../backend";
import { useActor } from "../hooks/useActor";

export default function TwilioConfig() {
  const { actor } = useActor();
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [accountSid, setAccountSid] = useState(
    "AC57ded10611d2c9e54b65c84d8b034f1a",
  );
  const [authToken, setAuthToken] = useState(
    "1d8dbe0a7cce1c23130ca03f55736f88",
  );
  const [fromNumber, setFromNumber] = useState("+18303594849");

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    checkTwilioStatus();
  }, [actor]);

  const checkTwilioStatus = async () => {
    if (!actor) return;

    try {
      const configured = await actor.isTwilioConfigured();
      setIsConfigured(configured);
    } catch (error) {
      console.error("Failed to check Twilio status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfiguration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!actor) {
      toast.error("Backend connection unavailable");
      return;
    }

    if (!accountSid || !authToken || !fromNumber) {
      toast.error("All fields are required");
      return;
    }

    setIsSaving(true);

    try {
      const config: TwilioConfiguration = {
        accountSid,
        authToken,
        fromNumber,
      };

      await actor.setTwilioConfiguration(config);
      setIsConfigured(true);

      toast.success("Twilio SMS service activated!", {
        description: "Phone OTP login is now available across all Fresh apps.",
      });
    } catch (error) {
      console.error("Failed to save Twilio configuration:", error);
      toast.error("Failed to save configuration", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Twilio SMS Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-admin-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Twilio SMS Configuration
        </CardTitle>
        <CardDescription>
          Configure Twilio credentials to enable phone OTP login across all
          Fresh apps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConfigured ? (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900 dark:text-green-100">
              Twilio SMS service is active. Phone OTP login is enabled for all
              apps.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Twilio SMS is not configured. Phone OTP login will not work until
              configured.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSaveConfiguration} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountSid">Twilio Account SID</Label>
            <Input
              id="accountSid"
              type="text"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={accountSid}
              onChange={(e) => setAccountSid(e.target.value)}
              required
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground">
              Your Twilio Account SID from the Twilio Console
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="authToken">Twilio Auth Token</Label>
            <Input
              id="authToken"
              type="password"
              placeholder="Your Twilio Auth Token"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              required
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground">
              Your Twilio Auth Token (keep this secret)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromNumber">Twilio Phone Number</Label>
            <Input
              id="fromNumber"
              type="tel"
              placeholder="+1234567890"
              value={fromNumber}
              onChange={(e) => setFromNumber(e.target.value)}
              required
              disabled={isSaving}
            />
            <p className="text-xs text-muted-foreground">
              Your Twilio phone number (must include country code, e.g., +1)
            </p>
          </div>

          <Button type="submit" disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving Configuration...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {isConfigured ? "Update Configuration" : "Activate Twilio SMS"}
              </>
            )}
          </Button>
        </form>

        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2 text-sm">Configuration Details:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Account SID: {accountSid || "Not set"}</li>
            <li>• From Number: {fromNumber || "Not set"}</li>
            <li>• Status: {isConfigured ? "Active ✓" : "Inactive"}</li>
          </ul>
        </div>

        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
          <AlertDescription className="text-sm">
            <strong>Note:</strong> Once configured, all Fresh apps (Customer,
            Delivery, Restaurant, Admin) will be able to send SMS verification
            codes for phone number login. Make sure your Twilio account has
            sufficient credits and the phone number is verified.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
