import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

export const metadata = { title: "Sign In" };

export const dynamic = "force-dynamic";

const googleEnabled =
  !!process.env.SUPABASE_URL &&
  !!process.env.SUPABASE_ANON_KEY &&
  !!process.env.SUPABASE_JWT_SECRET &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Suspense>
        <LoginForm googleEnabled={googleEnabled} />
      </Suspense>
    </div>
  );
}
