import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, MapPin, Package, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { loginWithCredentials, registerWithPhone } from "../lib/credentialAuth";

export default function DeliveryLoginPrompt() {
  const [tab, setTab] = useState("new");

  const [regPhone, setRegPhone] = useState("");
  const [regName, setRegName] = useState("");
  const [regResult, setRegResult] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = regPhone.replace(/\D/g, "");
    if (digits.length !== 10) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setRegLoading(true);
    const result = registerWithPhone(
      `+91${digits}`,
      regName.trim(),
      "delivery",
    );
    setRegLoading(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setRegResult({ username: result.username, password: result.password });
    toast.success("Account created! Save your credentials.");
  };

  const handleContinueAfterReg = () => {
    if (!regResult) return;
    const res = loginWithCredentials(regResult.username, regResult.password);
    if (res.success) toast.success(`Welcome, ${regName}! Ready to deliver 🚴`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const result = loginWithCredentials(loginUsername.trim(), loginPassword);
    setLoginLoading(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    if (result.user.role !== "delivery") {
      toast.error("This account is not a delivery partner account");
      return;
    }
    toast.success(`Welcome back, ${result.user.name}! 🚴`);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied!"));
  };

  return (
    <div className="flex-1 flex items-start justify-center bg-gradient-to-br from-blue-50 via-background to-blue-100/50 px-4 py-8">
      <div className="w-full max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          <div className="space-y-6 hidden lg:block pt-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Delivery <span className="text-blue-600">Partner Portal</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Earn more with every delivery. Join our network today.
              </p>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: Package,
                  title: "Manage Pickups",
                  desc: "View and accept delivery assignments",
                },
                {
                  icon: MapPin,
                  title: "Smart Routing",
                  desc: "Optimized delivery routes",
                },
                {
                  icon: Truck,
                  title: "Real-time Status",
                  desc: "Update order status on the go",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-100"
                >
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="rounded-full bg-blue-100 p-2">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Delivery Partner Portal</h2>
                <p className="text-xs text-muted-foreground">
                  Sign in to manage deliveries
                </p>
              </div>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="new" data-ocid="delivery.login.tab">
                  New Partner
                </TabsTrigger>
                <TabsTrigger value="login" data-ocid="delivery.login.tab">
                  Login
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="space-y-4">
                {!regResult ? (
                  <form onSubmit={handleRegister} className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="dreg-name">Full Name</Label>
                      <Input
                        id="dreg-name"
                        placeholder="e.g. Arjun Singh"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        data-ocid="delivery.login.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="dreg-phone">Mobile Number (+91)</Label>
                      <div className="flex gap-2">
                        <span className="flex items-center px-3 rounded-md border bg-muted text-sm font-medium">
                          +91
                        </span>
                        <Input
                          id="dreg-phone"
                          placeholder="10-digit number"
                          maxLength={10}
                          value={regPhone}
                          onChange={(e) =>
                            setRegPhone(e.target.value.replace(/\D/g, ""))
                          }
                          required
                          data-ocid="delivery.login.input"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={regLoading}
                      data-ocid="delivery.login.submit_button"
                    >
                      Register as Partner
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-amber-50 border-2 border-amber-300 p-4 space-y-3">
                      <p className="text-sm font-bold text-amber-800 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Account Created! Save these:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-white rounded-lg border border-amber-200 px-3 py-2">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Username
                            </p>
                            <p className="font-mono font-bold text-sm">
                              {regResult.username}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyText(regResult.username)}
                            data-ocid="delivery.login.button"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg border border-amber-200 px-3 py-2">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Password
                            </p>
                            <p className="font-mono font-bold text-sm">
                              {regResult.password}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyText(regResult.password)}
                            data-ocid="delivery.login.button"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleContinueAfterReg}
                      data-ocid="delivery.login.primary_button"
                    >
                      I've saved it, Continue →
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="dlogin-username">Username</Label>
                    <Input
                      id="dlogin-username"
                      placeholder="e.g. ride_1234"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                      data-ocid="delivery.login.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="dlogin-password">Password</Label>
                    <Input
                      id="dlogin-password"
                      type="password"
                      placeholder="Your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      data-ocid="delivery.login.input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loginLoading}
                    data-ocid="delivery.login.submit_button"
                  >
                    Login
                  </Button>
                </form>
                <p className="text-xs text-center text-muted-foreground">
                  Forgot credentials? Contact admin to reset your password.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
