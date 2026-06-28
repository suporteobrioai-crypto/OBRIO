import { NextRequest, NextResponse } from "next/server";
import { isValidPhoneBR, normalizePhoneBR } from "@/lib/auth/normalize-phone";
import {
  findValidInvite,
  isSignupOpenWithoutToken
} from "@/lib/auth/signup-invite";
import { createAdminClient } from "@/lib/supabase/admin";

type SignupBody = {
  email?: string;
  password?: string;
  whatsapp?: string;
  token?: string;
};

export async function POST(request: NextRequest) {
  let body: SignupBody;

  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Corpo inválido." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  const whatsapp = body.whatsapp ?? "";
  const token = body.token ?? "";

  if (!email || !password || !whatsapp) {
    return NextResponse.json(
      { ok: false, error: "Preencha email, senha e WhatsApp." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "A senha deve ter pelo menos 8 caracteres." },
      { status: 400 }
    );
  }

  if (!isValidPhoneBR(whatsapp)) {
    return NextResponse.json(
      { ok: false, error: "Informe um WhatsApp válido com DDD." },
      { status: 400 }
    );
  }

  const normalizedWhatsapp = normalizePhoneBR(whatsapp);
  if (!normalizedWhatsapp) {
    return NextResponse.json(
      { ok: false, error: "WhatsApp inválido." },
      { status: 400 }
    );
  }

  const openSignup = isSignupOpenWithoutToken();
  let plan: "gratuito" | "mensal" | "premium" = "gratuito";
  let inviteId: string | null = null;

  if (!openSignup) {
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Use o link enviado após a compra para criar sua conta." },
        { status: 403 }
      );
    }

    const inviteResult = await findValidInvite(email, token);
    if (!inviteResult.ok) {
      return NextResponse.json({ ok: false, error: inviteResult.reason }, { status: 403 });
    }

    plan = inviteResult.invite.plan;
    inviteId = inviteResult.invite.id;
  }

  const admin = createAdminClient();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { whatsapp: normalizedWhatsapp }
  });

  if (createError || !created.user) {
    const message = createError?.message ?? "Não foi possível criar a conta.";
    const status = message.toLowerCase().includes("already") ? 409 : 500;
    const friendly =
      status === 409 ? "Este email já possui conta. Faça login." : message;
    return NextResponse.json({ ok: false, error: friendly }, { status });
  }

  const userId = created.user.id;

  const { error: profileError } = await admin
    .from("profiles")
    .update({ whatsapp: normalizedWhatsapp })
    .eq("id", userId);

  if (profileError) {
    return NextResponse.json(
      { ok: false, error: "Conta criada, mas falha ao salvar WhatsApp. Contate o suporte." },
      { status: 500 }
    );
  }

  const { error: subscriptionError } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status: "active"
    },
    { onConflict: "user_id" }
  );

  if (subscriptionError) {
    return NextResponse.json(
      { ok: false, error: "Conta criada, mas falha ao ativar assinatura. Contate o suporte." },
      { status: 500 }
    );
  }

  if (inviteId) {
    await admin
      .from("signup_invites")
      .update({ consumed_at: new Date().toISOString() })
      .eq("id", inviteId);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
