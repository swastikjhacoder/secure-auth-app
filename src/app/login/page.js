"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function bufferDecode(value) {
  return Uint8Array.from(
    atob(value.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0),
  );
}

function bufferEncode(value) {
  return btoa(String.fromCharCode(...new Uint8Array(value)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const options = await res.json();
      if (!res.ok) throw new Error(options.error || "Login failed");

      options.challenge = bufferDecode(options.challenge);

      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((cred) => ({
          ...cred,
          id: bufferDecode(cred.id),
        }));
      }

      const credential = await navigator.credentials.get({
        publicKey: options,
      });

      if (!credential) {
        throw new Error("Authentication was cancelled");
      }

      const verifyRes = await fetch("/api/auth/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          credential: {
            id: credential.id,
            rawId: bufferEncode(credential.rawId),
            type: credential.type,
            response: {
              authenticatorData: bufferEncode(
                credential.response.authenticatorData,
              ),
              clientDataJSON: bufferEncode(credential.response.clientDataJSON),
              signature: bufferEncode(credential.response.signature),
              userHandle: credential.response.userHandle
                ? bufferEncode(credential.response.userHandle)
                : null,
            },
          },
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-black dark:via-zinc-900 dark:to-black px-6 py-20">
      <div className="w-full max-w-md rounded-2xl border bg-card shadow-xl">
        <div className="p-10 space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold">Passkey Login</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign in securely using your device
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login with Passkey"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
