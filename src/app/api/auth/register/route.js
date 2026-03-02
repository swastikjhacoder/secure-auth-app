import { NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sanitizeInput } from "@/lib/sanitize";

const rpName = "Your App";
const rpID = process.env.RP_ID || "localhost";
const origin = process.env.ORIGIN || "http://localhost:3000";

export async function POST(req) {
  try {
    await connectDB();

    let body = await req.json();
    body = sanitizeInput(body);

    const { email } = body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        credentials: [],
      });
    }

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: Buffer.from(user._id.toString()),
      userName: email,
      timeout: 60000,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
      },
      excludeCredentials: user.credentials.map((cred) => ({
        id: cred.credentialID,
        type: "public-key",
      })),
    });

    user.currentChallenge = options.challenge;
    await user.save();

    return NextResponse.json(options);
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }
}
