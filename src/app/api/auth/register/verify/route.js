import { NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const rpID = process.env.RP_ID || "localhost";
const origin = process.env.ORIGIN || "http://localhost:3000";

export async function POST(req) {
  try {
    await connectDB();

    const { email, credential } = await req.json();

    if (!email || !credential) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user || !user.currentChallenge) {
      return NextResponse.json(
        { error: "Registration session not found" },
        { status: 400 },
      );
    }

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 },
      );
    }

    // ✅ v13 structure
    const registrationCredential = verification.registrationInfo.credential;

    user.credentials.push({
      credentialID: Buffer.from(registrationCredential.id),
      publicKey: Buffer.from(registrationCredential.publicKey),
      counter: registrationCredential.counter,
      transports: registrationCredential.transports || [],
    });

    user.currentChallenge = undefined;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REGISTER VERIFY ERROR:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }
}
