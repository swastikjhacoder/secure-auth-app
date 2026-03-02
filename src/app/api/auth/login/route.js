import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { loginSchema } from "@/lib/validation";
import { sanitizeInput } from "@/lib/sanitize";
import { signToken } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";

export async function POST(req) {
  try {
    await connectDB();

    let body = await req.json();
    body = sanitizeInput(body);

    const { email, password } = loginSchema.parse(body);

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return NextResponse.json(
        { error: "Account locked. Try later." },
        { status: 403 },
      );
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000;
      }

      await user.save();

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    user.loginAttempts = 0;
    await user.save();

    const rawToken = signToken(user._id.toString());
    const encryptedToken = encrypt(rawToken);

    const response = NextResponse.json({ success: true });

    response.cookies.set("token", encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
