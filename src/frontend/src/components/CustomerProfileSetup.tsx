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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateCustomerProfile,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";

export default function CustomerProfileSetup() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const saveProfile = useSaveCallerUserProfile();
  const createCustomerProfile = useCreateCustomerProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter your address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save user profile first
      await saveProfile.mutateAsync({
        name: name.trim(),
        userType: "customer",
      });

      // Then create customer-specific profile
      await createCustomerProfile.mutateAsync({
        name: name.trim(),
        address: address.trim(),
      });

      toast.success("Profile created successfully! Welcome to Fresh!");

      // Small delay to ensure queries refetch before UI updates
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile");
      console.error("Profile creation error:", error);
      setIsSubmitting(false);
    }
  };

  const isLoading =
    isSubmitting || saveProfile.isPending || createCustomerProfile.isPending;

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-fresh-50 via-background to-fresh-100/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Welcome to Fresh!</CardTitle>
          <CardDescription>Let's set up your customer profile</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Your Address</Label>
              <Input
                id="address"
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
