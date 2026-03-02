import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-black dark:via-zinc-900 dark:to-black flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-5xl space-y-20">
        <div className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Secure Authentication System
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Production-grade login architecture built with hardened security
            layers, strict validation, protected cookies, and defensive database
            design.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="h-full rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="p-10 space-y-6">
              <h3 className="text-2xl font-semibold">Security Layers</h3>

              <ul className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <li>• JWT in httpOnly secure cookies</li>
                <li>• Strict Content Security Policy</li>
                <li>• NoSQL injection prevention</li>
                <li>• Zod input validation</li>
                <li>• Account lock + brute force defense</li>
              </ul>
            </div>
          </div>

          <div className="h-full rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="p-10 space-y-6">
              <h3 className="text-2xl font-semibold">Architecture</h3>

              <ul className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <li>• Next.js App Router</li>
                <li>• MongoDB Strict Schema Mode</li>
                <li>• Middleware Route Protection</li>
                <li>• Rate Limiting Strategy</li>
                <li>• Short-lived JWT tokens</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ================= CTA SECTION ================= */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-10 border-t border-border">
          <Link
            href="/login"
            className="w-full sm:w-auto min-w-[180px] px-10 py-4 rounded-xl font-semibold text-white 
                       bg-gradient-to-r from-indigo-600 to-purple-600
                       shadow-lg shadow-indigo-500/30
                       hover:from-indigo-500 hover:to-purple-500
                       hover:shadow-indigo-500/50
                       transition-all duration-300 text-center"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto min-w-[180px] px-10 py-4 rounded-xl font-semibold
                       bg-gradient-to-r from-gray-800 to-gray-900
                       text-white
                       shadow-lg shadow-gray-500/30
                       hover:from-gray-700 hover:to-black
                       hover:shadow-gray-500/50
                       transition-all duration-300 text-center"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
