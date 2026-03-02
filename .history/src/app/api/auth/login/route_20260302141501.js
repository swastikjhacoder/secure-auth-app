import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "models/User";
import { loginSchema } from "@/lib/validation";
import { sanitizeInput } from "@/lib/sanitize";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    let body = await req.json();
    body = sanitizeInput(body);

    const { email, password } = loginSchema.parse(body);

    const user = await User.findOne({ email });

    if (!user) throw new Error();

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
      throw new Error();
    }

    user.loginAttempts = 0;
    await user.save();

    const token = signToken(user._id.toString());

    cookies().set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 15,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
