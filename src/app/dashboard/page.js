import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { decrypt } from "@/lib/crypto";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const encryptedToken = cookieStore.get("token")?.value;

  if (!encryptedToken) {
    redirect("/login");
  }

  let token;

  try {
    token = decrypt(encryptedToken);
  } catch {
    redirect("/login");
  }

  if (!token) {
    redirect("/login");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    redirect("/login");
  }

  await connectDB();

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    redirect("/login");
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br 
                    from-gray-100 via-white to-gray-200 
                    dark:from-black dark:via-zinc-900 dark:to-black 
                    px-6 py-20"
    >
      <div className="max-w-4xl mx-auto space-y-10">
        <div
          className="rounded-2xl bg-card border border-border 
                        shadow-xl p-10 space-y-6"
        >
          <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>

          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>User ID:</strong> {user._id.toString()}
            </p>
            <p>
              <strong>Account Created:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-semibold text-white 
                       bg-gradient-to-r from-red-600 to-rose-600
                       shadow-lg shadow-red-500/30
                       hover:from-red-500 hover:to-rose-500
                       transition-all duration-300"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
