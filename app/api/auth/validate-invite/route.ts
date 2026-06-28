import { NextRequest, NextResponse } from "next/server";
import {
  findValidInvite,
  isSignupOpenWithoutToken
} from "@/lib/auth/signup-invite";

export async function GET(request: NextRequest) {
  if (isSignupOpenWithoutToken()) {
    return NextResponse.json({ ok: true, open: true });
  }

  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  const token = request.nextUrl.searchParams.get("token");

  if (!email || !token) {
    return NextResponse.json(
      { ok: false, reason: "Link incompleto. Use o link enviado após a compra." },
      { status: 400 }
    );
  }

  const result = await findValidInvite(email, token);

  if (!result.ok) {
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    email: result.invite.email,
    buyerName: result.invite.buyer_name
  });
}
