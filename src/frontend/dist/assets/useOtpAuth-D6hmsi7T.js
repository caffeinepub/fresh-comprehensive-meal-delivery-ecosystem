import { p as useQueryClient, r as reactExports } from "./index-BfIGtKmp.js";
import { u as useActor } from "./useActor-ClP9Ae-Z.js";
const OTP_SESSION_KEY = "fresh_otp_session";
const OTP_AUTH_KEY = "fresh_otp_authenticated";
const OTP_EXPIRY_MS = 5 * 60 * 1e3;
function useOtpAuth() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [status, setStatus] = reactExports.useState("idle");
  const [error, setError] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [lastSendTime, setLastSendTime] = reactExports.useState(0);
  const [isAuthenticated, setIsAuthenticated] = reactExports.useState(false);
  const [userIdentifier, setUserIdentifier] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const stored = localStorage.getItem(OTP_SESSION_KEY);
    const authStored = localStorage.getItem(OTP_AUTH_KEY);
    if (authStored) {
      try {
        const authData = JSON.parse(authStored);
        if (Date.now() - authData.timestamp < OTP_EXPIRY_MS) {
          setIsAuthenticated(true);
          setUserIdentifier(authData.identifier);
        } else {
          localStorage.removeItem(OTP_AUTH_KEY);
        }
      } catch (_e) {
        localStorage.removeItem(OTP_AUTH_KEY);
      }
    }
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < OTP_EXPIRY_MS) {
          setSession(parsed);
        } else {
          localStorage.removeItem(OTP_SESSION_KEY);
        }
      } catch (_e) {
        localStorage.removeItem(OTP_SESSION_KEY);
      }
    }
  }, []);
  const clearSession = reactExports.useCallback(() => {
    setSession(null);
    setError(null);
    setStatus("idle");
    localStorage.removeItem(OTP_SESSION_KEY);
  }, []);
  const logout = reactExports.useCallback(() => {
    clearSession();
    setIsAuthenticated(false);
    setUserIdentifier(null);
    localStorage.removeItem(OTP_AUTH_KEY);
    queryClient.clear();
  }, [clearSession, queryClient]);
  const sendOtp = reactExports.useCallback(
    async (method, identifier) => {
      if (!actor) {
        const errorMsg = "Backend connection unavailable. Please check your network and try again.";
        setError(errorMsg);
        setStatus("error");
        throw new Error(errorMsg);
      }
      setStatus("sending");
      setError(null);
      try {
        let otpStatus;
        if (method === "email") {
          otpStatus = await actor.sendEmailOtp(identifier);
        } else {
          otpStatus = await actor.sendPhoneOtp(identifier);
        }
        if (otpStatus.__kind__ === "delivered") {
          const newSession = {
            method,
            identifier,
            timestamp: Date.now(),
            verified: false
          };
          setSession(newSession);
          setLastSendTime(Date.now());
          localStorage.setItem(OTP_SESSION_KEY, JSON.stringify(newSession));
          setStatus("idle");
        } else if (otpStatus.__kind__ === "twilioResponse") {
          const newSession = {
            method,
            identifier,
            timestamp: Date.now(),
            verified: false
          };
          setSession(newSession);
          setLastSendTime(Date.now());
          localStorage.setItem(OTP_SESSION_KEY, JSON.stringify(newSession));
          setStatus("idle");
        } else if (otpStatus.__kind__ === "invalidPhoneNumber") {
          throw new Error(
            "Only Indian phone numbers (+91) are supported. Please enter a valid Indian phone number."
          );
        } else if (otpStatus.__kind__ === "twilioMissing") {
          throw new Error(
            "SMS service is not configured. Please contact support or use email login."
          );
        } else if (otpStatus.__kind__ === "twilioError") {
          throw new Error(
            `SMS delivery failed: ${otpStatus.twilioError}. Please try again or use email login.`
          );
        } else if (otpStatus.__kind__ === "smsFailed") {
          throw new Error(
            `SMS delivery failed: ${otpStatus.smsFailed}. Please verify your phone number or use email login.`
          );
        } else {
          throw new Error("Failed to deliver OTP code. Please try again.");
        }
      } catch (e) {
        let errorMessage = "Failed to send verification code. Please try again.";
        if (e instanceof Error) {
          if (e.message.includes("fetch") || e.message.includes("network") || e.message.includes("NetworkError")) {
            errorMessage = "Network issue detected. Please check your internet connection and retry.";
          } else if (e.message.includes("timeout")) {
            errorMessage = "Request timed out. Please check your connection and try again.";
          } else if (e.message.includes("canister")) {
            errorMessage = "Service temporarily unavailable. Please try again in a moment.";
          } else if (e.message.includes("Indian phone") || e.message.includes("+91")) {
            errorMessage = e.message;
          } else if (e.message.includes("SMS service") || e.message.includes("SMS delivery")) {
            errorMessage = e.message;
          } else if (e.message.includes("Unauthorized") || e.message.includes("trap")) {
            errorMessage = "Service error. Please contact support if this persists.";
          } else if (e.message) {
            errorMessage = e.message;
          }
        }
        setError(errorMessage);
        setStatus("error");
        throw new Error(errorMessage);
      }
    },
    [actor]
  );
  const verifyOtp = reactExports.useCallback(
    async (otp) => {
      if (!actor) {
        const errorMsg = "Backend connection unavailable. Please check your network and try again.";
        setError(errorMsg);
        setStatus("error");
        return false;
      }
      if (!session) {
        const errorMsg = "No active OTP session. Please request a new verification code.";
        setError(errorMsg);
        setStatus("error");
        return false;
      }
      setStatus("verifying");
      setError(null);
      try {
        let otpStatus;
        if (session.method === "email") {
          otpStatus = await actor.verifyEmailOtp(session.identifier, otp);
        } else {
          otpStatus = await actor.verifyPhoneOtp(session.identifier, otp);
        }
        if (otpStatus.__kind__ === "verified") {
          const verifiedSession = { ...session, verified: true };
          setSession(verifiedSession);
          localStorage.setItem(
            OTP_SESSION_KEY,
            JSON.stringify(verifiedSession)
          );
          const authData = {
            identifier: session.identifier,
            method: session.method,
            timestamp: Date.now()
          };
          localStorage.setItem(OTP_AUTH_KEY, JSON.stringify(authData));
          setIsAuthenticated(true);
          setUserIdentifier(session.identifier);
          setStatus("success");
          return true;
        }
        if (otpStatus.__kind__ === "expired") {
          const errorMsg2 = "Verification code has expired. Please request a new code.";
          setError(errorMsg2);
          setStatus("error");
          return false;
        }
        if (otpStatus.__kind__ === "invalid") {
          const errorMsg2 = "Invalid verification code. Please check the code and try again.";
          setError(errorMsg2);
          setStatus("error");
          return false;
        }
        if (otpStatus.__kind__ === "notFound") {
          const errorMsg2 = "No verification code found. Please request a new code.";
          setError(errorMsg2);
          setStatus("error");
          return false;
        }
        if (otpStatus.__kind__ === "alreadyVerified") {
          const errorMsg2 = "This code has already been used. Please request a new code.";
          setError(errorMsg2);
          setStatus("error");
          return false;
        }
        const errorMsg = "Verification failed. Please try again.";
        setError(errorMsg);
        setStatus("error");
        return false;
      } catch (e) {
        let errorMessage = "Verification failed. Please try again.";
        if (e instanceof Error) {
          if (e.message.includes("fetch") || e.message.includes("network") || e.message.includes("NetworkError")) {
            errorMessage = "Network issue detected. Please check your internet connection and retry.";
          } else if (e.message.includes("timeout")) {
            errorMessage = "Request timed out. Please check your connection and try again.";
          } else if (e.message.includes("canister")) {
            errorMessage = "Service temporarily unavailable. Please try again in a moment.";
          } else if (e.message.includes("expired")) {
            errorMessage = "Verification code has expired. Please request a new code.";
          } else if (e.message.includes("Unauthorized") || e.message.includes("trap")) {
            errorMessage = "Service error. Please contact support if this persists.";
          } else if (e.message) {
            errorMessage = `Error: ${e.message}`;
          }
        }
        setError(errorMessage);
        setStatus("error");
        return false;
      }
    },
    [actor, session]
  );
  const resendOtp = reactExports.useCallback(async () => {
    if (!session) {
      const errorMsg = "No active session to resend. Please start a new login attempt.";
      setError(errorMsg);
      setStatus("error");
      throw new Error(errorMsg);
    }
    await sendOtp(session.method, session.identifier);
  }, [session, sendOtp]);
  const canResend = Date.now() - lastSendTime > 3e4;
  return {
    sendOtp,
    verifyOtp,
    resendOtp,
    clearSession,
    logout,
    status,
    error,
    session,
    canResend,
    isAuthenticated,
    userIdentifier
  };
}
export {
  useOtpAuth as u
};
