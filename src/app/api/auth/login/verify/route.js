import { NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";

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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.currentChallenge) {
      return NextResponse.json(
        { error: "Authentication session expired" },
        { status: 400 },
      );
    }

    const incomingID = Buffer.from(credential.rawId, "base64url");

    const authenticator = user.credentials.find((cred) =>
      cred.credentialID.equals(incomingID),
    );

    if (!authenticator) {
      return NextResponse.json(
        { error: "Authenticator not found" },
        { status: 400 },
      );
    }

    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: authenticator.credentialID,
        credentialPublicKey: authenticator.publicKey,
        counter: authenticator.counter,
        transports: authenticator.transports || [],
      },
      requireUserVerification: true,
    });

    if (!verification.verified) {
      return NextResponse.json(
        { error: "Authentication verification failed" },
        { status: 401 },
      );
    }

    if (verification.authenticationInfo) {
      authenticator.counter = verification.authenticationInfo.newCounter;
    }

    user.currentChallenge = undefined;
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
      priority: "high",
    });

    return response;
  } catch (error) {
    console.error("LOGIN VERIFY ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Authentication failed" },
      { status: 400 },
    );
  }
}
