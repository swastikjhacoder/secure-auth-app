import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="w-full max-w-4xl space-y-10 text-center">
        {/* Title Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Secure Authentication System
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Production-grade login system built with Next.js, MongoDB, JWT,
            strict validation, and hardened security layers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 text-left">
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Security Layers</h3>
            <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
              <li>• JWT (httpOnly cookies)</li>
              <li>• Strict Content Security Policy</li>
              <li>• NoSQL injection prevention</li>
              <li>• Input validation (Zod)</li>
              <li>• Account lock protection</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Architecture</h3>
            <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Next.js App Router</li>
              <li>• MongoDB (Strict Schema)</li>
              <li>• Secure Middleware</li>
              <li>• Rate Limiting</li>
              <li>• Short-lived Tokens</li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium transition hover:opacity-90"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 font-medium transition hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
