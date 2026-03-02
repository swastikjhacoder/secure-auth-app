export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        action="/api/auth/login"
        method="POST"
        className="bg-gray-800 p-8 rounded-xl shadow-xl w-96 space-y-4"
      >
        <h2 className="text-white text-2xl font-bold text-center">
          Secure Login
        </h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 rounded bg-gray-700 text-white"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 rounded bg-gray-700 text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
