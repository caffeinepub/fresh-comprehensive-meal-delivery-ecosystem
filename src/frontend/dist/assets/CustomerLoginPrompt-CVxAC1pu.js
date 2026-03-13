import { r as reactExports, j as jsxRuntimeExports, l as Utensils, T as Truck, B as Button, m as User, f as ue, n as registerWithPhone, o as loginWithCredentials } from "./index-BfIGtKmp.js";
import { B as Badge } from "./badge-D8WDHAry.js";
import { I as Input } from "./input-Cv-sn70i.js";
import { L as Label } from "./label-CvVyz3q6.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D-ln3Msz.js";
import { C as Calendar } from "./calendar-Cd_UEZVC.js";
import { C as Check } from "./check-DZsTBaVH.js";
import { C as Copy } from "./copy-CkRpgmQ-.js";
function CustomerLoginPrompt() {
  const [tab, setTab] = reactExports.useState("new");
  const [regPhone, setRegPhone] = reactExports.useState("");
  const [regName, setRegName] = reactExports.useState("");
  const [regResult, setRegResult] = reactExports.useState(null);
  const [regLoading, setRegLoading] = reactExports.useState(false);
  const [loginUsername, setLoginUsername] = reactExports.useState("");
  const [loginPassword, setLoginPassword] = reactExports.useState("");
  const [loginLoading, setLoginLoading] = reactExports.useState(false);
  const [guestName, setGuestName] = reactExports.useState("");
  const handleRegister = (e) => {
    e.preventDefault();
    const digits = regPhone.replace(/\D/g, "");
    if (digits.length !== 10) {
      ue.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setRegLoading(true);
    const result = registerWithPhone(
      `+91${digits}`,
      regName.trim(),
      "customer"
    );
    setRegLoading(false);
    if (!result.success) {
      ue.error(result.error);
      return;
    }
    setRegResult({ username: result.username, password: result.password });
    ue.success("Account created! Save your credentials.");
  };
  const handleContinueAfterReg = () => {
    if (!regResult) return;
    const res = loginWithCredentials(regResult.username, regResult.password);
    if (res.success) {
      ue.success(`Welcome, ${regName}! 🎉`);
    }
  };
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const result = loginWithCredentials(loginUsername.trim(), loginPassword);
    setLoginLoading(false);
    if (!result.success) {
      ue.error(result.error);
      return;
    }
    if (result.user.role !== "customer") {
      ue.error("This account is not a customer account");
      return;
    }
    ue.success(`Welcome back, ${result.user.name}! 🎉`);
  };
  const handleGuest = (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      ue.error("Please enter your name");
      return;
    }
    localStorage.setItem(
      "fresh_guest_session",
      JSON.stringify({ name: guestName.trim(), isGuest: true })
    );
    window.dispatchEvent(new Event("storage"));
    ue.success(`Welcome, ${guestName.trim()}! Let's book your meal 🎉`);
  };
  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => ue.success("Copied!"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center bg-gradient-to-br from-fresh-50 via-background to-fresh-100/50 px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-6xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-2 lg:gap-12 items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 hidden lg:block pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-bold tracking-tight", children: [
          "Welcome to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-fresh-600", children: "Fresh" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground mt-2", children: "Home-cooked meals delivered fast." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
        {
          icon: Utensils,
          title: "Dabba Pickup",
          desc: "Daily tiffin from home to office"
        },
        {
          icon: Calendar,
          title: "Meal Plans",
          desc: "Weekly & monthly subscriptions"
        },
        {
          icon: Truck,
          title: "Live Tracking",
          desc: "Real-time order updates"
        }
      ].map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-3 p-4 rounded-xl bg-fresh-50/60 border border-fresh-100",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-fresh-100 p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-fresh-600" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: desc })
            ] })
          ]
        },
        title
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-lg border border-border p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-fresh-100 p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Utensils, { className: "h-5 w-5 text-fresh-600" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-lg", children: "Fresh Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Sign in to start booking" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: setTab, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "new", "data-ocid": "login.tab", children: "New User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "login", "data-ocid": "login.tab", children: "Login" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "guest", "data-ocid": "login.tab", children: "Guest" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "new", className: "space-y-4", children: !regResult ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRegister, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reg-name", children: "Full Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "reg-name",
                placeholder: "e.g. Ravi Kumar",
                value: regName,
                onChange: (e) => setRegName(e.target.value),
                required: true,
                "data-ocid": "login.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reg-phone", children: "Mobile Number (+91)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center px-3 rounded-md border bg-muted text-sm font-medium", children: "+91" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "reg-phone",
                  placeholder: "10-digit number",
                  maxLength: 10,
                  value: regPhone,
                  onChange: (e) => setRegPhone(e.target.value.replace(/\D/g, "")),
                  required: true,
                  "data-ocid": "login.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "w-full bg-fresh-600 hover:bg-fresh-700 text-white",
              disabled: regLoading,
              "data-ocid": "login.submit_button",
              children: "Register"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-amber-50 border-2 border-amber-300 p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-amber-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
              "Account Created! Save these credentials:"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-white rounded-lg border border-amber-200 px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Username" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-sm", children: regResult.username })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => copyText(regResult.username),
                    "data-ocid": "login.button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between bg-white rounded-lg border border-amber-200 px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Password" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-sm", children: regResult.password })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => copyText(regResult.password),
                    "data-ocid": "login.button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-700", children: "Screenshot or note these down — you'll need them to login next time." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full bg-fresh-600 hover:bg-fresh-700 text-white",
              onClick: handleContinueAfterReg,
              "data-ocid": "login.primary_button",
              children: "I've saved it, Continue →"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "login", className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "login-username", children: "Username" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "login-username",
                  placeholder: "e.g. cust_1234",
                  value: loginUsername,
                  onChange: (e) => setLoginUsername(e.target.value),
                  required: true,
                  "data-ocid": "login.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "login-password", children: "Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "login-password",
                  type: "password",
                  placeholder: "Your password",
                  value: loginPassword,
                  onChange: (e) => setLoginPassword(e.target.value),
                  required: true,
                  "data-ocid": "login.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "w-full bg-fresh-600 hover:bg-fresh-700 text-white",
                disabled: loginLoading,
                "data-ocid": "login.submit_button",
                children: "Login"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground", children: "Forgot credentials? Contact admin to reset your password." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "guest", className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No account needed — just enter your name and start booking!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleGuest, className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "guest-name", children: "Your Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "guest-name",
                  placeholder: "e.g. Ravi Kumar",
                  value: guestName,
                  onChange: (e) => setGuestName(e.target.value),
                  required: true,
                  "data-ocid": "login.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                className: "w-full bg-fresh-600 hover:bg-fresh-700 text-white",
                "data-ocid": "login.submit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 mr-2" }),
                  "Start Booking"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted/50 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: "Tip" }),
            "Register to save your bookings and get order history."
          ] })
        ] })
      ] })
    ] })
  ] }) }) });
}
export {
  CustomerLoginPrompt as default
};
