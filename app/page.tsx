import { Suspense } from "react";
import LoginForm from "@/app/login/LoginForm";

export default function Home() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
