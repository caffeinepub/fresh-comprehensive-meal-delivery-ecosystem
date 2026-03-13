// Credential auth system - stored in localStorage for fast access
export interface CredentialUser {
  userId: string;
  username: string;
  phone: string;
  name: string;
  role: "customer" | "delivery" | "restaurant";
  password: string; // stored plain for admin recovery
}

const CRED_STORE_KEY = "fresh_all_credentials"; // all registered users (for admin)
const SESSION_KEY = "fresh_credential_session"; // current logged-in user

// Get all registered users (used by admin)
export function getAllCredentialUsers(): CredentialUser[] {
  try {
    return JSON.parse(localStorage.getItem(CRED_STORE_KEY) || "[]");
  } catch {
    return [];
  }
}

// Register a new user with phone
export function registerWithPhone(
  phone: string,
  name: string,
  role: "customer" | "delivery" | "restaurant",
):
  | { success: false; error: string }
  | { success: true; username: string; password: string } {
  const users = getAllCredentialUsers();
  const existing = users.find((u) => u.phone === phone && u.role === role);
  if (existing) {
    return {
      success: false,
      error: `Already registered. Your username is: ${existing.username}`,
    };
  }
  const last4 = phone.replace(/\D/g, "").slice(-4);
  const prefix =
    role === "customer" ? "cust" : role === "delivery" ? "ride" : "rest";
  const username = `${prefix}_${last4}`;
  const password = `Fresh@${last4}`;
  const userId = `${role}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const newUser: CredentialUser = {
    userId,
    username,
    phone,
    name,
    role,
    password,
  };
  users.push(newUser);
  localStorage.setItem(CRED_STORE_KEY, JSON.stringify(users));
  return { success: true, username, password };
}

// Login with credentials
export function loginWithCredentials(
  username: string,
  password: string,
): { success: false; error: string } | { success: true; user: CredentialUser } {
  const users = getAllCredentialUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) return { success: false, error: "Invalid username or password" };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("storage"));
  return { success: true, user };
}

// Get current session
export function getCredentialSession(): CredentialUser | null {
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

// Logout
export function clearCredentialSession() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("storage"));
}

// Admin: update a user's password
export function adminUpdatePassword(
  username: string,
  newPassword: string,
): boolean {
  const users = getAllCredentialUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return false;
  users[idx].password = newPassword;
  localStorage.setItem(CRED_STORE_KEY, JSON.stringify(users));
  // If this user is currently logged in, update session
  const session = getCredentialSession();
  if (session?.username === username) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx]));
  }
  return true;
}
