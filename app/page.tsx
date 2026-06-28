import { Suspense } from "react";
import AuthScreen from "@/components/auth/AuthScreen";

export default function Home() {
  return (
    <Suspense>
      <AuthScreen />
    </Suspense>
  );
}
