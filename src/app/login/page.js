"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-gray-100 via-white to-gray-200 
                    dark:from-black dark:via-zinc-900 dark:to-black 
                    px-6 py-20"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border 
                      bg-card shadow-xl"
      >
        <div className="p-10 space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold">Secure Login</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Access your account securely
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border 
                           bg-background focus:outline-none 
                           focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border 
                           bg-background focus:outline-none 
                           focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white 
                         bg-gradient-to-r from-indigo-600 to-purple-600
                         shadow-lg shadow-indigo-500/30
                         hover:from-indigo-500 hover:to-purple-500
                         transition-all duration-300 
                         disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-indigo-600 dark:text-indigo-400 
                         font-medium hover:underline"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
