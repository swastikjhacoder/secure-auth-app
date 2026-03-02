import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sanitizeInput } from "@/lib/sanitize";

const rpID = process.env.RP_ID || "localhost";

export async function POST(req) {
  try {
    await connectDB();

    let body = await req.json();
    body = sanitizeInput(body);

    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user || user.credentials.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const options = await generateAuthenticationOptions({
      rpID,
      timeout: 60000,
      allowCredentials: user.credentials.map((cred) => ({
        id: cred.credentialID.toString("base64url"),
        type: "public-key",
        transports: cred.transports || [],
      })),
      userVerification: "required",
    });

    user.currentChallenge = options.challenge;
    await user.save();

    return NextResponse.json(options);
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 400 },
    );
  }
}
