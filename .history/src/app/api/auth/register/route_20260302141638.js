import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validation";
import { sanitizeInput } from "@/lib/sanitize";

export async function POST(req) {
  try {
    await connectDB();

    let body = await req.json();
    body = sanitizeInput(body);

    const { email, password } = registerSchema.parse(body);

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered" });
  } catch (err) {
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }
}
