import { c as createLucideIcon, u as useInternetIdentity, j as jsxRuntimeExports, B as Button } from "./index-BfIGtKmp.js";
import { u as useOtpAuth } from "./useOtpAuth-D6hmsi7T.js";
import "./useActor-ClP9Ae-Z.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m14.5 9.5-5 5", key: "17q4r4" }],
  ["path", { d: "m9.5 9.5 5 5", key: "18nt4w" }]
];
const ShieldX = createLucideIcon("shield-x", __iconNode);
function AccessDenied({ appName }) {
  const { logout } = useOtpAuth();
  const { clear } = useInternetIdentity();
  const handleLogout = () => {
    logout();
    clear();
    localStorage.removeItem("userProfile");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 via-background to-red-100/40 p-6",
      "data-ocid": "access_denied.panel",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex max-w-sm flex-col items-center gap-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-20 w-20 items-center justify-center rounded-full bg-red-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldX, { className: "h-10 w-10 text-red-600" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Access Denied" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            "This account doesn't have access to the",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: appName }),
            " app."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Please log in with the correct account or contact support." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleLogout,
            variant: "destructive",
            className: "w-full",
            "data-ocid": "access_denied.primary_button",
            children: "Log Out & Switch Account"
          }
        )
      ] })
    }
  );
}
export {
  AccessDenied as default
};
