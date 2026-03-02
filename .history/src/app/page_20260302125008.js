import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-black dark:via-zinc-900 dark:to-black flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-5xl space-y-14">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Secure Authentication System
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Production-grade login architecture built with hardened security
            layers, strict validation, protected cookies, and defensive database
            design.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="p-8 rounded-2xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border border-gray-200 dark:border-zinc-800 shadow-xl shadow-gray-300/40 dark:shadow-black/40 transition hover:scale-[1.02] duration-300">
            <h3 className="text-xl font-semibold mb-4">Security Layers</h3>

            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li>• JWT in httpOnly secure cookies</li>
              <li>• Strict Content Security Policy</li>
              <li>• NoSQL injection prevention</li>
              <li>• Zod input validation</li>
              <li>• Account lock + brute force defense</li>
            </ul>
          </div>

          {/* Architecture Card */}
          <div className="p-8 rounded-2xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border border-gray-200 dark:border-zinc-800 shadow-xl shadow-gray-300/40 dark:shadow-black/40 transition hover:scale-[1.02] duration-300">
            <h3 className="text-xl font-semibold mb-4">Architecture</h3>

            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li>• Next.js App Router</li>
              <li>• MongoDB Strict Schema Mode</li>
              <li>• Middleware Route Protection</li>
              <li>• Rate Limiting Strategy</li>
              <li>• Short-lived JWT tokens</li>
            </ul>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-6 pt-4">
          <Link
            href="/login"
            className="px-8 py-3 rounded-xl font-semibold text-white 
                       bg-gradient-to-r from-indigo-600 to-purple-600
                       shadow-lg shadow-indigo-500/30
                       hover:from-indigo-500 hover:to-purple-500
                       hover:shadow-indigo-500/50
                       transition-all duration-300"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-8 py-3 rounded-xl font-semibold
                       bg-gradient-to-r from-gray-800 to-gray-900
                       text-white
                       shadow-lg shadow-gray-500/30
                       hover:from-gray-700 hover:to-black
                       hover:shadow-gray-500/50
                       transition-all duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
