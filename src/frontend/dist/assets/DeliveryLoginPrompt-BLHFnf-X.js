import { r as reactExports, j as jsxRuntimeExports, T as Truck, B as Button, f as ue, n as registerWithPhone, o as loginWithCredentials } from "./index-BfIGtKmp.js";
import { I as Input } from "./input-Cv-sn70i.js";
import { L as Label } from "./label-CvVyz3q6.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D-ln3Msz.js";
import { P as Package } from "./package-BfaQt1xr.js";
import { M as MapPin } from "./map-pin-DDrx7xfO.js";
import { C as Check } from "./check-DZsTBaVH.js";
import { C as Copy } from "./copy-CkRpgmQ-.js";
function DeliveryLoginPrompt() {
  const [tab, setTab] = reactExports.useState("new");
  const [regPhone, setRegPhone] = reactExports.useState("");
  const [regName, setRegName] = reactExports.useState("");
  const [regResult, setRegResult] = reactExports.useState(null);
  const [regLoading, setRegLoading] = reactExports.useState(false);
  const [loginUsername, setLoginUsername] = reactExports.useState("");
  const [loginPassword, setLoginPassword] = reactExports.useState("");
  const [loginLoading, setLoginLoading] = reactExports.useState(false);
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
      "delivery"
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
    if (res.success) ue.success(`Welcome, ${regName}! Ready to deliver 🚴`);
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
    if (result.user.role !== "delivery") {
      ue.error("This account is not a delivery partner account");
      return;
    }
    ue.success(`Welcome back, ${result.user.name}! 🚴`);
  };
  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => ue.success("Copied!"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-start justify-center bg-gradient-to-br from-blue-50 via-background to-blue-100/50 px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-6xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-2 lg:gap-12 items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 hidden lg:block pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-bold tracking-tight", children: [
          "Delivery ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-600", children: "Partner Portal" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground mt-2", children: "Earn more with every delivery. Join our network today." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
        {
          icon: Package,
          title: "Manage Pickups",
          desc: "View and accept delivery assignments"
        },
        {
          icon: MapPin,
          title: "Smart Routing",
          desc: "Optimized delivery routes"
        },
        {
          icon: Truck,
          title: "Real-time Status",
          desc: "Update order status on the go"
        }
      ].map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-100",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-blue-100 p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-blue-600" }) }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-blue-100 p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-5 w-5 text-blue-600" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-lg", children: "Delivery Partner Portal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Sign in to manage deliveries" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: setTab, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "new", "data-ocid": "delivery.login.tab", children: "New Partner" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "login", "data-ocid": "delivery.login.tab", children: "Login" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "new", className: "space-y-4", children: !regResult ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRegister, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dreg-name", children: "Full Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "dreg-name",
                placeholder: "e.g. Arjun Singh",
                value: regName,
                onChange: (e) => setRegName(e.target.value),
                required: true,
                "data-ocid": "delivery.login.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dreg-phone", children: "Mobile Number (+91)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center px-3 rounded-md border bg-muted text-sm font-medium", children: "+91" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "dreg-phone",
                  placeholder: "10-digit number",
                  maxLength: 10,
                  value: regPhone,
                  onChange: (e) => setRegPhone(e.target.value.replace(/\D/g, "")),
                  required: true,
                  "data-ocid": "delivery.login.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "w-full bg-blue-600 hover:bg-blue-700 text-white",
              disabled: regLoading,
              "data-ocid": "delivery.login.submit_button",
              children: "Register as Partner"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-amber-50 border-2 border-amber-300 p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-amber-800 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
              "Account Created! Save these:"
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
                    "data-ocid": "delivery.login.button",
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
                    "data-ocid": "delivery.login.button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full bg-blue-600 hover:bg-blue-700 text-white",
              onClick: handleContinueAfterReg,
              "data-ocid": "delivery.login.primary_button",
              children: "I've saved it, Continue →"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "login", className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dlogin-username", children: "Username" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "dlogin-username",
                  placeholder: "e.g. ride_1234",
                  value: loginUsername,
                  onChange: (e) => setLoginUsername(e.target.value),
                  required: true,
                  "data-ocid": "delivery.login.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dlogin-password", children: "Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "dlogin-password",
                  type: "password",
                  placeholder: "Your password",
                  value: loginPassword,
                  onChange: (e) => setLoginPassword(e.target.value),
                  required: true,
                  "data-ocid": "delivery.login.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "w-full bg-blue-600 hover:bg-blue-700 text-white",
                disabled: loginLoading,
                "data-ocid": "delivery.login.submit_button",
                children: "Login"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground", children: "Forgot credentials? Contact admin to reset your password." })
        ] })
      ] })
    ] })
  ] }) }) });
}
export {
  DeliveryLoginPrompt as default
};
