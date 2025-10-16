export type AuthResponse = { token: string };

const API = process.env.NEXT_PUBLIC_API_BASE || "https://api.bitechx.com";

export async function postAuth(email: string): Promise<AuthResponse> {
  const res = await fetch(`${API}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Auth failed with status ${res.status}`);
  }
  return res.json();
}
