export function getToken(): string | null {
  const token = localStorage.getItem("token");
  return token || null;
}

export function saveToken(token: string): void {
  localStorage.setItem("token", token);
}

export function saveUser(user: Record<string, unknown>): void {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser(): Record<string, unknown> | null {
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
}
