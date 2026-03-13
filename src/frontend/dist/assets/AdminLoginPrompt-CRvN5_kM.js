import { c as createLucideIcon, u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, S as Shield, C as Card, a as CardHeader, b as CardTitle, d as CardDescription, e as CardContent, B as Button, f as ue } from "./index-BfIGtKmp.js";
import { U as Users, A as Alert, C as CircleAlert, a as AlertDescription, b as CircleCheck, K as KeyRound } from "./alert-D6deBIqq.js";
import { I as Input } from "./input-Cv-sn70i.js";
import { L as Label } from "./label-CvVyz3q6.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D-ln3Msz.js";
import { u as useOtpAuth } from "./useOtpAuth-D6hmsi7T.js";
import { C as ChartColumn } from "./chart-column-Ci12SMaJ.js";
import { P as Phone } from "./phone-y6Iqopgb.js";
import { L as LoaderCircle } from "./loader-circle-DnbbqiBo.js";
import "./useActor-ClP9Ae-Z.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode);
const ADMIN_PASSWORD = "@fresh1111";
const ADMIN_PASSWORD_KEY = "fresh_admin_password_auth";
function AdminLoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();
  const {
    sendOtp,
    verifyOtp,
    resendOtp,
    clearSession,
    status,
    error,
    session,
    canResend
  } = useOtpAuth();
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [otp, setOtp] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("password");
  const [adminPassword, setAdminPassword] = reactExports.useState("");
  const [passwordError, setPasswordError] = reactExports.useState("");
  const isLoggingIn = loginStatus === "logging-in";
  const isSending = status === "sending";
  const isVerifying = status === "verifying";
  reactExports.useEffect(() => {
    setOtp("");
  }, [activeTab]);
  const isValidIndianPhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\s/g, "");
    return cleaned.startsWith("+91") && cleaned.length >= 13;
  };
  const handleAdminPasswordLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_PASSWORD_KEY, "true");
      ue.success("Admin login successful!");
      window.location.reload();
    } else {
      setPasswordError("Incorrect admin password. Please try again.");
    }
  };
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      ue.error("Please enter your email address");
      return;
    }
    try {
      await sendOtp("email", email);
      ue.success("Verification code sent! Check your email.", {
        description: "The code will expire in 5 minutes."
      });
    } catch (error2) {
      ue.error("Failed to send verification code", {
        description: error2 instanceof Error ? error2.message : "Please check your email and try again."
      });
    }
  };
  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (!phone) {
      ue.error("Please enter your phone number");
      return;
    }
    if (!isValidIndianPhone(phone)) {
      ue.error("Invalid phone number", {
        description: "Only Indian phone numbers (+91) are supported."
      });
      return;
    }
    try {
      await sendOtp("phone", phone);
      ue.success("Verification code sent! Check your phone.", {
        description: "The code will expire in 5 minutes."
      });
    } catch (error2) {
      ue.error("Failed to send verification code", {
        description: error2 instanceof Error ? error2.message : "Please check your phone number and try again."
      });
    }
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      ue.error("Please enter a valid 6-digit code");
      return;
    }
    try {
      const isValid = await verifyOtp(otp);
      if (isValid) {
        ue.success("Login successful!", {
          description: "Welcome to Fresh Admin. Redirecting..."
        });
      } else {
        ue.error("Invalid verification code", {
          description: "Please check the code and try again."
        });
      }
    } catch (_error) {
      ue.error("Verification failed", {
        description: "Network error. Please try again."
      });
    }
  };
  const handleResendOtp = async () => {
    if (!canResend) {
      ue.error("Please wait before resending");
      return;
    }
    try {
      await resendOtp();
      ue.success("New verification code sent!");
      setOtp("");
    } catch (error2) {
      ue.error("Failed to resend code", {
        description: error2 instanceof Error ? error2.message : "Please try again."
      });
    }
  };
  const handleBackToInput = () => {
    clearSession();
    setOtp("");
    setEmail("");
    setPhone("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-background to-slate-100/50 px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container max-w-6xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-2 lg:gap-12 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl", children: [
          "Fresh",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-slate-600 to-slate-500 bg-clip-text text-transparent", children: "Admin" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-muted-foreground", children: "Manage the entire Fresh ecosystem with comprehensive admin controls." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-950/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 text-slate-600 flex-shrink-0 mt-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: "User Management" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage customers, restaurants, and delivery partners" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-950/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-6 w-6 text-slate-600 flex-shrink-0 mt-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: "Analytics Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "View comprehensive metrics and performance data" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-950/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6 text-slate-600 flex-shrink-0 mt-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg", children: "Platform Controls" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Activate/deactivate accounts and manage system settings" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-slate-200 dark:border-slate-800 shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Admin Login" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Choose your preferred login method" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          error && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error })
          ] }),
          status === "success" && (session == null ? void 0 : session.verified) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mb-4 border-slate-200 bg-slate-50 dark:bg-slate-950/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-slate-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-slate-900 dark:text-slate-100", children: "Successfully verified! Logging you in..." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Tabs,
            {
              value: activeTab,
              onValueChange: setActiveTab,
              className: "w-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "password", "data-ocid": "admin.tab", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4 mr-1" }),
                    "Admin"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "identity", "data-ocid": "admin.tab", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 mr-1" }),
                    "ID"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "email", "data-ocid": "admin.tab", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 mr-1" }),
                    "Email"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "phone", "data-ocid": "admin.tab", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 mr-1" }),
                    "Phone"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "password", className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Use your admin password to access the dashboard directly." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "form",
                    {
                      onSubmit: handleAdminPasswordLogin,
                      className: "space-y-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-password", children: "Admin Password" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              id: "admin-password",
                              "data-ocid": "admin.input",
                              type: "password",
                              placeholder: "Enter admin password",
                              value: adminPassword,
                              onChange: (e) => {
                                setAdminPassword(e.target.value);
                                setPasswordError("");
                              },
                              required: true,
                              autoFocus: true
                            }
                          ),
                          passwordError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: passwordError })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            type: "submit",
                            "data-ocid": "admin.submit_button",
                            size: "lg",
                            className: "w-full bg-slate-700 hover:bg-slate-800",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-5 w-5 mr-2" }),
                              "Login as Admin"
                            ]
                          }
                        )
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "identity", className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Secure login with Internet Identity - no passwords needed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      onClick: login,
                      disabled: isLoggingIn,
                      size: "lg",
                      className: "w-full gap-2 bg-slate-600 hover:bg-slate-700",
                      children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
                        " Logging in..."
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-5 w-5" }),
                        " Login with Internet Identity"
                      ] })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "email", className: "space-y-4", children: !session || session.method !== "email" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEmailLogin, className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email Address" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "email",
                        "data-ocid": "admin.input",
                        type: "email",
                        placeholder: "admin@fresh.com",
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        required: true,
                        disabled: isSending
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: isSending,
                      size: "lg",
                      className: "w-full bg-slate-600 hover:bg-slate-700",
                      children: isSending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin mr-2" }),
                        " ",
                        "Sending..."
                      ] }) : "Send Verification Code"
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleVerifyOtp, className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "otp", children: "Verification Code" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "otp",
                        "data-ocid": "admin.input",
                        type: "text",
                        placeholder: "Enter 6-digit code",
                        value: otp,
                        onChange: (e) => setOtp(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        ),
                        maxLength: 6,
                        required: true,
                        disabled: isVerifying,
                        autoFocus: true,
                        className: "text-center text-2xl tracking-widest"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Code sent to ",
                      session.identifier
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: isVerifying || otp.length !== 6,
                      size: "lg",
                      className: "w-full bg-slate-600 hover:bg-slate-700",
                      children: isVerifying ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin mr-2" }),
                        " ",
                        "Verifying..."
                      ] }) : "Verify & Login"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "sm",
                        className: "flex-1",
                        onClick: handleResendOtp,
                        disabled: !canResend || isSending,
                        children: isSending ? "Sending..." : "Resend Code"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        className: "flex-1",
                        onClick: handleBackToInput,
                        children: "Use different email"
                      }
                    )
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "phone", className: "space-y-4", children: !session || session.method !== "phone" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handlePhoneLogin, className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Indian Phone Number" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "phone",
                        "data-ocid": "admin.input",
                        type: "tel",
                        placeholder: "+91 98765 43210",
                        value: phone,
                        onChange: (e) => setPhone(e.target.value),
                        required: true,
                        disabled: isSending
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Only Indian phone numbers (+91) are supported" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: isSending,
                      size: "lg",
                      className: "w-full bg-slate-600 hover:bg-slate-700",
                      children: isSending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin mr-2" }),
                        " ",
                        "Sending..."
                      ] }) : "Send Verification Code"
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleVerifyOtp, className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "otp-phone", children: "Verification Code" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "otp-phone",
                        "data-ocid": "admin.input",
                        type: "text",
                        placeholder: "Enter 6-digit code",
                        value: otp,
                        onChange: (e) => setOtp(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        ),
                        maxLength: 6,
                        required: true,
                        disabled: isVerifying,
                        autoFocus: true,
                        className: "text-center text-2xl tracking-widest"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Code sent to ",
                      session.identifier
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: isVerifying || otp.length !== 6,
                      size: "lg",
                      className: "w-full bg-slate-600 hover:bg-slate-700",
                      children: isVerifying ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin mr-2" }),
                        " ",
                        "Verifying..."
                      ] }) : "Verify & Login"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "sm",
                        className: "flex-1",
                        onClick: handleResendOtp,
                        disabled: !canResend || isSending,
                        children: isSending ? "Sending..." : "Resend Code"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        className: "flex-1",
                        onClick: handleBackToInput,
                        children: "Use different phone"
                      }
                    )
                  ] })
                ] }) })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative hidden lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: "/assets/generated/admin-dashboard.dim_800x600.jpg",
        alt: "Fresh Admin Dashboard",
        className: "rounded-2xl shadow-2xl w-full h-auto"
      }
    ) })
  ] }) }) });
}
export {
  AdminLoginPrompt as default
};
