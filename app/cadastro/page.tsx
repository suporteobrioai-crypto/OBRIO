import { redirect } from "next/navigation";
import { isSignupEnabled } from "@/lib/auth/signup-enabled";

type CadastroPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CadastroPage({ searchParams }: CadastroPageProps) {
  if (!isSignupEnabled()) {
    redirect("/");
  }

  const params = await searchParams;
  const query = new URLSearchParams();

  query.set("mode", "cadastro");

  for (const [key, value] of Object.entries(params)) {
    if (key === "mode" || value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else {
      query.set(key, value);
    }
  }

  redirect(`/?${query.toString()}`);
}
