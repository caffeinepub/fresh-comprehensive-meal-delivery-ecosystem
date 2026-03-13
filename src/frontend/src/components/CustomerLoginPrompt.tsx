import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Check, Copy, Truck, User, Utensils } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { loginWithCredentials, registerWithPhone } from "../lib/credentialAuth";

export default function CustomerLoginPrompt() {
  const [tab, setTab] = useState("new");

  // New user
  const [regPhone, setRegPhone] = useState("");
  const [regName, setRegName] = useState("");
  const [regResult, setRegResult] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [regLoading, setRegLoading] = useState(false);

  // Login
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Guest
  const [guestName, setGuestName] = useState("");

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
      "customer",
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
    if (res.success) {
      toast.success(`Welcome, ${regName}! 🎉`);
    }
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
    if (result.user.role !== "customer") {
      toast.error("This account is not a customer account");
      return;
    }
    toast.success(`Welcome back, ${result.user.name}! 🎉`);
  };

  const handleGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    localStorage.setItem(
      "fresh_guest_session",
      JSON.stringify({ name: guestName.trim(), isGuest: true }),
    );
    window.dispatchEvent(new Event("storage"));
    toast.success(`Welcome, ${guestName.trim()}! Let's book your meal 🎉`);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied!"));
  };

  return (
    <div className="flex-1 flex items-start justify-center bg-gradient-to-br from-fresh-50 via-background to-fresh-100/50 px-4 py-8">
      <div className="w-full max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          {/* Left: Feature highlights */}
          <div className="space-y-6 hidden lg:block pt-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome to <span className="text-fresh-600">Fresh</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Home-cooked meals delivered fast.
              </p>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: Utensils,
                  title: "Dabba Pickup",
                  desc: "Daily tiffin from home to office",
                },
                {
                  icon: Calendar,
                  title: "Meal Plans",
                  desc: "Weekly & monthly subscriptions",
                },
                {
                  icon: Truck,
                  title: "Live Tracking",
                  desc: "Real-time order updates",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-fresh-50/60 border border-fresh-100"
                >
                  <div className="rounded-lg bg-fresh-100 p-2">
                    <Icon className="h-5 w-5 text-fresh-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Login card */}
          <div className="bg-white rounded-2xl shadow-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="rounded-full bg-fresh-100 p-2">
                <Utensils className="h-5 w-5 text-fresh-600" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Fresh Customer</h2>
                <p className="text-xs text-muted-foreground">
                  Sign in to start booking
                </p>
              </div>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="new" data-ocid="login.tab">
                  New User
                </TabsTrigger>
                <TabsTrigger value="login" data-ocid="login.tab">
                  Login
                </TabsTrigger>
                <TabsTrigger value="guest" data-ocid="login.tab">
                  Guest
                </TabsTrigger>
              </TabsList>

              {/* New User */}
              <TabsContent value="new" className="space-y-4">
                {!regResult ? (
                  <form onSubmit={handleRegister} className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input
                        id="reg-name"
                        placeholder="e.g. Ravi Kumar"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        data-ocid="login.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="reg-phone">Mobile Number (+91)</Label>
                      <div className="flex gap-2">
                        <span className="flex items-center px-3 rounded-md border bg-muted text-sm font-medium">
                          +91
                        </span>
                        <Input
                          id="reg-phone"
                          placeholder="10-digit number"
                          maxLength={10}
                          value={regPhone}
                          onChange={(e) =>
                            setRegPhone(e.target.value.replace(/\D/g, ""))
                          }
                          required
                          data-ocid="login.input"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-fresh-600 hover:bg-fresh-700 text-white"
                      disabled={regLoading}
                      data-ocid="login.submit_button"
                    >
                      Register
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-xl bg-amber-50 border-2 border-amber-300 p-4 space-y-3">
                      <p className="text-sm font-bold text-amber-800 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Account Created! Save these credentials:
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
                            data-ocid="login.button"
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
                            data-ocid="login.button"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-amber-700">
                        Screenshot or note these down — you'll need them to
                        login next time.
                      </p>
                    </div>
                    <Button
                      className="w-full bg-fresh-600 hover:bg-fresh-700 text-white"
                      onClick={handleContinueAfterReg}
                      data-ocid="login.primary_button"
                    >
                      I've saved it, Continue →
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Login */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      placeholder="e.g. cust_1234"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                      data-ocid="login.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      data-ocid="login.input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-fresh-600 hover:bg-fresh-700 text-white"
                    disabled={loginLoading}
                    data-ocid="login.submit_button"
                  >
                    Login
                  </Button>
                </form>
                <p className="text-xs text-center text-muted-foreground">
                  Forgot credentials? Contact admin to reset your password.
                </p>
              </TabsContent>

              {/* Guest */}
              <TabsContent value="guest" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  No account needed — just enter your name and start booking!
                </p>
                <form onSubmit={handleGuest} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="guest-name">Your Name</Label>
                    <Input
                      id="guest-name"
                      placeholder="e.g. Ravi Kumar"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      data-ocid="login.input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-fresh-600 hover:bg-fresh-700 text-white"
                    data-ocid="login.submit_button"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Start Booking
                  </Button>
                </form>
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted/50 rounded-lg">
                  <Badge variant="secondary" className="text-xs">
                    Tip
                  </Badge>
                  Register to save your bookings and get order history.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
