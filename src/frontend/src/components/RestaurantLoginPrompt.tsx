import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Check, ChefHat, Copy, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { loginWithCredentials, registerWithPhone } from "../lib/credentialAuth";

export default function RestaurantLoginPrompt() {
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
      "restaurant",
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
    if (res.success)
      toast.success(`Welcome, ${regName}! Let's manage your kitchen 🍳`);
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
    if (result.user.role !== "restaurant") {
      toast.error("This account is not a restaurant partner account");
      return;
    }
    toast.success(`Welcome back, ${result.user.name}! 🍳`);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied!"));
  };

  return (
    <div className="flex-1 flex items-start justify-center bg-gradient-to-br from-orange-50 via-background to-orange-100/50 px-4 py-8">
      <div className="w-full max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          <div className="space-y-6 hidden lg:block pt-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Restaurant{" "}
                <span className="text-orange-600">Partner Portal</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Grow your business with Fresh's delivery network.
              </p>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: UtensilsCrossed,
                  title: "Manage Menu",
                  desc: "Add and update your menu items",
                },
                {
                  icon: BarChart3,
                  title: "Order Analytics",
                  desc: "Track orders and revenue",
                },
                {
                  icon: ChefHat,
                  title: "Kitchen Dashboard",
                  desc: "Real-time order management",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-orange-50/60 border border-orange-100"
                >
                  <div className="rounded-lg bg-orange-100 p-2">
                    <Icon className="h-5 w-5 text-orange-600" />
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
              <div className="rounded-full bg-orange-100 p-2">
                <ChefHat className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Restaurant Partner Portal</h2>
                <p className="text-xs text-muted-foreground">
                  Sign in to manage your restaurant
                </p>
              </div>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="new" data-ocid="restaurant.login.tab">
                  New Partner
                </TabsTrigger>
                <TabsTrigger value="login" data-ocid="restaurant.login.tab">
                  Login
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="space-y-4">
                {!regResult ? (
                  <form onSubmit={handleRegister} className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="rreg-name">Restaurant / Owner Name</Label>
                      <Input
                        id="rreg-name"
                        placeholder="e.g. Priya's Kitchen"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        data-ocid="restaurant.login.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="rreg-phone">Mobile Number (+91)</Label>
                      <div className="flex gap-2">
                        <span className="flex items-center px-3 rounded-md border bg-muted text-sm font-medium">
                          +91
                        </span>
                        <Input
                          id="rreg-phone"
                          placeholder="10-digit number"
                          maxLength={10}
                          value={regPhone}
                          onChange={(e) =>
                            setRegPhone(e.target.value.replace(/\D/g, ""))
                          }
                          required
                          data-ocid="restaurant.login.input"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      disabled={regLoading}
                      data-ocid="restaurant.login.submit_button"
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
                            data-ocid="restaurant.login.button"
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
                            data-ocid="restaurant.login.button"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={handleContinueAfterReg}
                      data-ocid="restaurant.login.primary_button"
                    >
                      I've saved it, Continue →
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="rlogin-username">Username</Label>
                    <Input
                      id="rlogin-username"
                      placeholder="e.g. rest_1234"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                      data-ocid="restaurant.login.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="rlogin-password">Password</Label>
                    <Input
                      id="rlogin-password"
                      type="password"
                      placeholder="Your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      data-ocid="restaurant.login.input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    disabled={loginLoading}
                    data-ocid="restaurant.login.submit_button"
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
