import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import type { OtpStatus } from "../backend";
import { useActor } from "./useActor";

export type OtpAuthStatus =
  | "idle"
  | "sending"
  | "verifying"
  | "success"
  | "error";
export type OtpMethod = "email" | "phone";

interface OtpSession {
  method: OtpMethod;
  identifier: string;
  timestamp: number;
  verified: boolean;
}

const OTP_SESSION_KEY = "fresh_otp_session";
const OTP_AUTH_KEY = "fresh_otp_authenticated";
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export interface UseOtpAuthReturn {
  sendOtp: (method: OtpMethod, identifier: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  resendOtp: () => Promise<void>;
  clearSession: () => void;
  logout: () => void;
  status: OtpAuthStatus;
  error: string | null;
  session: OtpSession | null;
  canResend: boolean;
  isAuthenticated: boolean;
  userIdentifier: string | null;
}

export function useOtpAuth(): UseOtpAuthReturn {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<OtpAuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<OtpSession | null>(null);
  const [lastSendTime, setLastSendTime] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userIdentifier, setUserIdentifier] = useState<string | null>(null);

  // Load session and auth state from localStorage on mount
  useEffect(() => {
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
        const parsed = JSON.parse(stored) as OtpSession;
        // Check if session is still valid
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

  const clearSession = useCallback(() => {
    setSession(null);
    setError(null);
    setStatus("idle");
    localStorage.removeItem(OTP_SESSION_KEY);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setIsAuthenticated(false);
    setUserIdentifier(null);
    localStorage.removeItem(OTP_AUTH_KEY);
    queryClient.clear();
  }, [clearSession, queryClient]);

  const sendOtp = useCallback(
    async (method: OtpMethod, identifier: string) => {
      if (!actor) {
        const errorMsg =
          "Backend connection unavailable. Please check your network and try again.";
        setError(errorMsg);
        setStatus("error");
        throw new Error(errorMsg);
      }

      setStatus("sending");
      setError(null);

      try {
        // Call backend to generate and send OTP
        let otpStatus: OtpStatus;
        if (method === "email") {
          otpStatus = await actor.sendEmailOtp(identifier);
        } else {
          otpStatus = await actor.sendPhoneOtp(identifier);
        }

        // Check the OTP status response
        if (otpStatus.__kind__ === "delivered") {
          const newSession: OtpSession = {
            method,
            identifier,
            timestamp: Date.now(),
            verified: false,
          };

          setSession(newSession);
          setLastSendTime(Date.now());
          localStorage.setItem(OTP_SESSION_KEY, JSON.stringify(newSession));
          setStatus("idle");
        } else if (otpStatus.__kind__ === "twilioResponse") {
          // Twilio SMS sent successfully
          const newSession: OtpSession = {
            method,
            identifier,
            timestamp: Date.now(),
            verified: false,
          };

          setSession(newSession);
          setLastSendTime(Date.now());
          localStorage.setItem(OTP_SESSION_KEY, JSON.stringify(newSession));
          setStatus("idle");
        } else if (otpStatus.__kind__ === "invalidPhoneNumber") {
          throw new Error(
            "Only Indian phone numbers (+91) are supported. Please enter a valid Indian phone number.",
          );
        } else if (otpStatus.__kind__ === "twilioMissing") {
          throw new Error(
            "SMS service is not configured. Please contact support or use email login.",
          );
        } else if (otpStatus.__kind__ === "twilioError") {
          throw new Error(
            `SMS delivery failed: ${otpStatus.twilioError}. Please try again or use email login.`,
          );
        } else if (otpStatus.__kind__ === "smsFailed") {
          throw new Error(
            `SMS delivery failed: ${otpStatus.smsFailed}. Please verify your phone number or use email login.`,
          );
        } else {
          throw new Error("Failed to deliver OTP code. Please try again.");
        }
      } catch (e) {
        let errorMessage =
          "Failed to send verification code. Please try again.";

        if (e instanceof Error) {
          // Check for network-related errors
          if (
            e.message.includes("fetch") ||
            e.message.includes("network") ||
            e.message.includes("NetworkError")
          ) {
            errorMessage =
              "Network issue detected. Please check your internet connection and retry.";
          } else if (e.message.includes("timeout")) {
            errorMessage =
              "Request timed out. Please check your connection and try again.";
          } else if (e.message.includes("canister")) {
            errorMessage =
              "Service temporarily unavailable. Please try again in a moment.";
          } else if (
            e.message.includes("Indian phone") ||
            e.message.includes("+91")
          ) {
            errorMessage = e.message; // Use the specific Indian phone number error message
          } else if (
            e.message.includes("SMS service") ||
            e.message.includes("SMS delivery")
          ) {
            errorMessage = e.message; // Use the specific SMS error message
          } else if (
            e.message.includes("Unauthorized") ||
            e.message.includes("trap")
          ) {
            errorMessage =
              "Service error. Please contact support if this persists.";
          } else if (e.message) {
            errorMessage = e.message;
          }
        }

        setError(errorMessage);
        setStatus("error");
        throw new Error(errorMessage);
      }
    },
    [actor],
  );

  const verifyOtp = useCallback(
    async (otp: string): Promise<boolean> => {
      if (!actor) {
        const errorMsg =
          "Backend connection unavailable. Please check your network and try again.";
        setError(errorMsg);
        setStatus("error");
        return false;
      }

      if (!session) {
        const errorMsg =
          "No active OTP session. Please request a new verification code.";
        setError(errorMsg);
        setStatus("error");
        return false;
      }

      setStatus("verifying");
      setError(null);

      try {
        let otpStatus: OtpStatus;

        if (session.method === "email") {
          otpStatus = await actor.verifyEmailOtp(session.identifier, otp);
        } else {
          otpStatus = await actor.verifyPhoneOtp(session.identifier, otp);
        }

        // Handle different OTP status responses
        if (otpStatus.__kind__ === "verified") {
          const verifiedSession = { ...session, verified: true };
          setSession(verifiedSession);
          localStorage.setItem(
            OTP_SESSION_KEY,
            JSON.stringify(verifiedSession),
          );

          // Set authentication state
          const authData = {
            identifier: session.identifier,
            method: session.method,
            timestamp: Date.now(),
          };
          localStorage.setItem(OTP_AUTH_KEY, JSON.stringify(authData));
          setIsAuthenticated(true);
          setUserIdentifier(session.identifier);

          setStatus("success");
          return true;
        }
        if (otpStatus.__kind__ === "expired") {
          const errorMsg =
            "Verification code has expired. Please request a new code.";
          setError(errorMsg);
          setStatus("error");
          return false;
        }
        if (otpStatus.__kind__ === "invalid") {
          const errorMsg =
            "Invalid verification code. Please check the code and try again.";
          setError(errorMsg);
          setStatus("error");
          return false;
        }
        if (otpStatus.__kind__ === "notFound") {
          const errorMsg =
            "No verification code found. Please request a new code.";
          setError(errorMsg);
          setStatus("error");
          return false;
        }
        if (otpStatus.__kind__ === "alreadyVerified") {
          const errorMsg =
            "This code has already been used. Please request a new code.";
          setError(errorMsg);
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
          // Check for network-related errors
          if (
            e.message.includes("fetch") ||
            e.message.includes("network") ||
            e.message.includes("NetworkError")
          ) {
            errorMessage =
              "Network issue detected. Please check your internet connection and retry.";
          } else if (e.message.includes("timeout")) {
            errorMessage =
              "Request timed out. Please check your connection and try again.";
          } else if (e.message.includes("canister")) {
            errorMessage =
              "Service temporarily unavailable. Please try again in a moment.";
          } else if (e.message.includes("expired")) {
            errorMessage =
              "Verification code has expired. Please request a new code.";
          } else if (
            e.message.includes("Unauthorized") ||
            e.message.includes("trap")
          ) {
            errorMessage =
              "Service error. Please contact support if this persists.";
          } else if (e.message) {
            errorMessage = `Error: ${e.message}`;
          }
        }

        setError(errorMessage);
        setStatus("error");
        return false;
      }
    },
    [actor, session],
  );

  const resendOtp = useCallback(async () => {
    if (!session) {
      const errorMsg =
        "No active session to resend. Please start a new login attempt.";
      setError(errorMsg);
      setStatus("error");
      throw new Error(errorMsg);
    }
    await sendOtp(session.method, session.identifier);
  }, [session, sendOtp]);

  const canResend = Date.now() - lastSendTime > 30000; // 30 seconds cooldown

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
    userIdentifier,
  };
}
