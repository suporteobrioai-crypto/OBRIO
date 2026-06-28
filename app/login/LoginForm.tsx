import { Suspense } from "react";
import AuthScreen from "@/components/auth/AuthScreen";

/** @deprecated Use AuthScreen via app/page.tsx */
export default function LoginForm() {
  return (
    <Suspense>
      <AuthScreen />
    </Suspense>
  );
}
